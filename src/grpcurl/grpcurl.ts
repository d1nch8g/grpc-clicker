import { GrpcCode, Message, ParsedResponse, Parser, Proto } from "./parser";
import { Caller, FileSource, ServerSource } from "./caller";
import { performance } from "perf_hooks";

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
  json: string;
  /**
   * Wether server will be used for exection
   */
  server: ServerSource;
  /**
   * `grpcurl` compatible call tag including proto and service:
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
export interface Matcher {
  description: string;
  actual: string;
  expected: string;
}

/**
 * Input parameters for message description
 */
export interface DescribeMessageParams {
  /**
   * Source that will be used for message description
   */
  source: FileSource | ServerSource;
  /**
   * `grpcurl` compatible message tag
   */
  messageTag: string;
}

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
 * Instance that is interacting with `grpcurl` via CLI
 */
export class Grpcurl {
  constructor(
    private parser: Parser,
    private caller: Caller,
    public useDocker: boolean
  ) {}

  /**
   * Describe proto from provided source
   */
  async proto(source: FileSource | ServerSource): Promise<Proto | string> {
    const command = `grpcurl -max-time 0.5 |SRC| describe`;
    const call = this.caller.buildCliCommand({
      cliCommand: command,
      useDocker: this.useDocker,
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
    const command = `grpcurl -msg-template |SRC| describe %s`;

    const call = this.caller.buildCliCommand({
      cliCommand: command,
      useDocker: this.useDocker,
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
   * Command to build `grpcurl` CLI request
   */
  formCall(input: Request): string {
    const command = `grpcurl -emit-defaults %s %s -d %s |SRC| %s`;
    const formedJson = this.jsonPreprocess(input.json);
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
        useDocker: this.useDocker,
        source: {
          type: `MULTI`,
          host: input.server.host,
          usePlaintext: input.server.usePlaintext,
          filePath: input.file.filePath,
          importPath: input.file.importPath,
        },
        args: [headersTemplate, maxMsgSizeTemplate, formedJson, input.callTag],
      });
    }
    return this.caller.buildCliCommand({
      cliCommand: command,
      useDocker: this.useDocker,
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
  async test(
    request: Request,
    expects: Expectations
  ): Promise<Matcher[] | undefined> {
    let result: Matcher[] = [];
    const resp = await this.send(request);
    if (resp.code !== expects.code) {
      result.push({
        description: "Code is not matching",
        actual: resp.code,
        expected: "",
      });
    }
    if (resp.time > expects.time) {
      result.push({
        description: "Time not matching",
        actual: `${resp.time}s`,
        expected: `${expects.time}s`,
      });
    }
    if (resp.content !== undefined && expects.content !== resp.content) {
      result.push({
        description: "Time not matching",
        actual: `${resp.content}s`,
        expected: `${expects.content}s`,
      });
    }
    if (result.length === 0) {
      return undefined;
    }
    return result;
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
