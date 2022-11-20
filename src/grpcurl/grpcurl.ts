import { GrpcCode, Message, ParsedResponse, Parser, Proto } from "./parser";
import { Caller, FileSource, ProtoSource } from "./caller";
import { performance } from "perf_hooks";
import { Installer } from "./installer";

/**
 * Data required for request execution
 */
export interface Request {
  /**
   * Optional parameter that will be used to form message if provided
   */
  file: FileSource | undefined;
  /**
   * Valid JSON string with proto message
   */
  content: string;
  /**
   * Wether server will be used for exection
   */
  server: ProtoSource;
  /**
   * `${this.executablePath}` compatible call tag including proto and service:
   * - Example - `.pb.v1.Constructions/EmptyCall`
   */
  callTag: string;
  /**
   * Number representing amount of megabytes, maximum recieved in
   * response message
   */
  maxMsgSize: number;
  /**
   * List of request headers that will be used for request execution
   */
  headers: string[];
}

/**
 * Parameters that will be used for comparison in test
 */
export interface Expectations {
  /**
   * Expected gRPC response code
   */
  code: GrpcCode;
  /**
   * Max amount of time that response can take to pass test
   */
  time: number;
  /**
   * Optional expected response message, should be JSON string or error message.
   *
   * If not provided, response would not be used in test.
   *
   * Comparison is strict, wether response is fully matching actual result.
   */
  content: string | undefined;
}

/**
 * Unified property to describe errors in tests
 */
export interface TestMistake {
  /**
   * Possible types of mistakes
   */
  type: MistakeType;
  /**
   * Recieved information
   */
  actual: string;
  /**
   * Matcher
   */
  expected: string;
}

/**
 * Currently checked options of mistakes
 */
export type MistakeType = `code` | `time` | `content`;

/**
 * Result of test execution
 */
export interface TestResult {
  passed: boolean;
  mistakes: TestMistake[];
}

/**
 * Input parameters for message description
 */
export interface DescribeMessageParams {
  /**
   * Source that will be used for message description
   */
  source: FileSource | ProtoSource;
  /**
   * `${this.executablePath}` compatible message tag
   */
  messageTag: string;
}

/**
 * Response of `${this.executablePath}` gRPC call
 */
export interface Response extends ParsedResponse {
  /**
   * Date converted to a string using Universal Coordinated Time (UTC).
   */
  date: string;
  /**
   * Time of request execution in seconds.
   */
  time: number;
}

/**
 * Instance that is interacting with `${this.executablePath}` via CLI
 */
export class Grpcurl {
  private executablePath: string;
  constructor(
    private parser: Parser,
    private caller: Caller,
    private installer: Installer,
    private extensionPath: string
  ) {
    if (process.platform === `win32`) {
      this.executablePath = extensionPath + `/dist/grpcurl/grpcurl.exe`;
      return;
    }
    this.executablePath = extensionPath + `/dist/grpcurl/grpcurl`;
  }

  /**
   * Describe proto from provided source
   */
  async install(path: string): Promise<string | undefined> {
    const downloadUrl = this.installer.getDownloadUrl();
    if (downloadUrl === undefined) {
      return `Your operating system is not supported by grpcurl, sorry!`;
    }
    const downloaded = await this.installer.download(
      downloadUrl,
      path + `.zip`
    );
    if (!downloaded) {
      return `Failed to download file, check internet connection`;
    }
    const unzipped = await this.installer.unzip(path + `.zip`, path);
    if (!unzipped) {
      return `Failed to unzip file gprcurl archive.`;
    }
    return undefined;
  }

  /**
   * Describe proto from provided source
   */
  async proto(source: FileSource | ProtoSource): Promise<Proto | string> {
    let timeout = ``;
    if (source.type === "SERVER") {
      timeout = `-max-time ${source.timeout}`;
    }
    const command = `${this.executablePath} ${timeout} |SRC| describe`;
    const call = this.caller.buildCliCommand({
      cliCommand: command,
      source: source,
      args: [],
    });
    const [output, err] = await this.caller.execute(call);
    if (err !== undefined) {
      return err.message;
    }
    const parsedProto = this.parser.proto(output);
    return parsedProto;
  }

  /**
   * Describe message from provided parameters
   */
  async message(params: DescribeMessageParams): Promise<Message | string> {
    const command = `${this.executablePath} -msg-template |SRC| describe %s`;

    const call = this.caller.buildCliCommand({
      cliCommand: command,
      source: params.source,
      args: [params.messageTag],
    });

    const [resp, err] = await this.caller.execute(call);
    if (err !== undefined) {
      return err.message;
    }
    const msg = this.parser.message(resp);
    return msg;
  }

  /**
   * Command to build `${this.executablePath}` CLI request
   */
  formCall(input: Request): string {
    const command = `${this.executablePath} -emit-defaults %s %s -d %s |SRC| %s`;
    const formedJson = this.jsonPreprocess(input.content);
    let maxMsgSizeTemplate = ``;
    if (input.maxMsgSize !== 4) {
      maxMsgSizeTemplate = `-max-msg-sz ${input.maxMsgSize * 1048576}`;
    }
    let headersTemplate = ``;
    for (const header of input.headers) {
      headersTemplate = headersTemplate + this.headerPreprocess(header);
    }

    if (input.file !== undefined) {
      return this.caller.buildCliCommand({
        cliCommand: command,
        source: {
          type: `MULTI`,
          host: input.server.host,
          plaintext: input.server.plaintext,
          filePath: input.file.filePath,
          importPath: input.file.importPath,
        },
        args: [headersTemplate, maxMsgSizeTemplate, formedJson, input.callTag],
      });
    }
    return this.caller.buildCliCommand({
      cliCommand: command,
      source: input.server,
      args: [headersTemplate, maxMsgSizeTemplate, formedJson, input.callTag],
    });
  }

  /**
   * Command to execute gRPC call on server
   */
  async send(input: Request): Promise<Response> {
    const start = performance.now();
    const [resp, err] = await this.caller.execute(this.formCall(input));
    const end = performance.now();

    let response: ParsedResponse;
    if (err !== undefined) {
      response = this.parser.resp(err.message);
    } else {
      response = this.parser.resp(resp);
    }

    return {
      code: response.code,
      content: response.content,
      date: new Date().toUTCString(),
      time: Math.round(end - start) / 1000,
    };
  }

  /**
   * Command to test gRPC call
   */
  async test(request: Request, expects: Expectations): Promise<TestResult> {
    let mistakes: TestMistake[] = [];
    const resp = await this.send(request);
    if (resp.code !== expects.code) {
      mistakes.push({
        type: `code`,
        actual: resp.code,
        expected: expects.code,
      });
    }
    if (resp.time > expects.time) {
      mistakes.push({
        type: `time`,
        actual: `${resp.time}s`,
        expected: `${expects.time}s`,
      });
    }
    if (resp.content !== undefined && expects.content !== resp.content) {
      mistakes.push({
        type: `content`,
        actual: `${resp.content}`,
        expected: `${expects.content}`,
      });
    }
    return { passed: mistakes.length === 0, mistakes: mistakes };
  }

  private jsonPreprocess(input: string): string {
    try {
      input = JSON.stringify(JSON.parse(input));
      if (process.platform === "win32") {
        input = input.replaceAll('"', '\\"');
        return `"${input}"`;
      }
      return `'${input}'`;
    } catch {
      return `INVALID JSON`;
    }
  }

  private headerPreprocess(header: string): string {
    if (process.platform === "win32") {
      return `-H "${header}" `;
    }
    return `-H '${header}' `;
  }
}
