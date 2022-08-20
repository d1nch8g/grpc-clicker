import { Message, Parser, Proto, Response } from "./parser";
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
   * - Example - `pb.v1.Constructions/EmptyCall`
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
 * Parameters that will be used testing of request
 */
export interface TestRequest extends Request {
  /**
   * Expected gRPC response code, available options:
   * - OK
   * - Cancelled
   * - Unknown
   * - InvalidArgument
   * - DeadlineExceeded
   * - NotFound
   * - AlreadyExists
   * - PermissionDenied
   * - ResourceExhausted
   * - FailedPrecondition
   * - Aborted
   * - OutOfRange
   * - Unimplemented
   * - Internal
   * - Unavailable
   * - DataLoss
   * - Unauthenticated
   */
  expectedCode: string;
  /**
   * Max amount of time that response can take to pass test
   */
  expectedTime: number;
  /**
   * Expected response message, should be JSON string or error message.
   * Comparison is strict, wether response is fully matching actual result.
   */
  expectedResponse: string;
}

/**
 * Result of text execution
 */
export interface TestResult {
  passed: boolean;
  /**
   * Human readable markdown representation of text execution
   */
  markdown: string;
}

/**
 * Input parameters for message description
 */
export interface DescribeMessage {
  /**
   * Source that will be used for message description
   */
  source: FileSource | ServerSource;
  /**
   * `grpcurl` compatible message tag
   */
  messageTag: string;
}

export class Grpcurl {
  constructor(
    private parser: Parser,
    private caller: Caller,
    public useDocker: boolean
  ) {}

  async proto(source: FileSource | ServerSource): Promise<Proto | string> {
    const command = `grpcurl |SRC| describe`;
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

  async message(): Promise<Message | string> {
    let command = `grpcurl -msg-template |SRC| describe %s`;

    const call = this.caller.buildCliCommand({
      cliCommand: command,
      source: input.source,
      server: input.server,
      plaintext: input.plaintext,
      useDocker: this.useDocker,
      args: [input.tag],
      importPath: input.importPath,
    });

    const [resp, err] = await this.caller.execute(call);
    if (err !== undefined) {
      return err.message;
    }
    const msg = this.parser.message(resp);
    return msg;
  }

  formCall(input: Request): string {
    const command = `grpcurl -emit-defaults %s %s -d %s |SRC| %s`;
    const formedJson = this.jsonPreprocess(input.json);
    let maxMsgSize = ``;
    if (input.maxMsgSize !== 4) {
      maxMsgSize = `-max-msg-sz ${input.maxMsgSize * 1048576}`;
    }
    let meta = ``;
    for (const metafield of input.headers) {
      meta = meta + this.headerPreprocess(metafield);
    }

    if (input.path === ``) {
      return this.caller.buildCliCommand({
        cliCommand: command,
        source: input.server.adress,
        server: true,
        plaintext: input.server.plaintext,
        useDocker: this.useDocker,
        args: [meta, maxMsgSize, formedJson, input.callTag],
        importPath: ``,
      });
    }
    return this.caller.buildCliCommand({
      cliCommand: command,
      source: `${input.path} ${input.server.adress}`,
      server: false,
      plaintext: input.server.plaintext,
      useDocker: this.useDocker,
      args: [meta, maxMsgSize, formedJson, input.callTag],
      importPath: input.importPath,
    });
  }

  async send(input: Request): Promise<Response> {
    const start = performance.now();
    const [resp, err] = await this.caller.execute(this.formCall(input));
    const end = performance.now();

    let response: Response;
    if (err !== undefined) {
      response = this.parser.resp(err.message);
    } else {
      response = this.parser.resp(resp);
    }

    response.date = new Date().toUTCString();
    response.time = Math.round(end - start) / 1000;
    return response;
  }

  // TODO add test
  async test(input: TestRequest): Promise<TestResult> {
    let result: string = ``;
    const resp = await this.send(input);
    if (resp.code !== input.expectedCode) {
      result = `- Code not matching: ${resp.code} vs ${input.expectedCode}\n`;
    }
    if (resp.time > input.expectedTime) {
      result += `- Time exceeded: ${resp.time}s vs ${input.expectedTime}s\n`;
    }
    if (input.expectedResponse !== ``) {
      try {
        const expect = JSON.stringify(JSON.parse(resp.response));
        const actual = JSON.stringify(JSON.parse(input.expectedResponse));
        if (expect !== actual) {
          result += `- Response json is not matching:\n\n
Expects:
\`\`\`json
${input.expectedResponse.split(`\n`).slice(0, 10).join(`\n`)}
\`\`\`

Actual:
\`\`\`json
${resp.response.split(`\n`).slice(0, 10).join(`\n`)}
\`\`\``;
        }
      } catch {
        if (resp.response !== input.expectedResponse) {
          result += `- Response is not matching:\n\n
Expect:
\`\`\`json
${input.expectedResponse}
\`\`\`

Actual:
\`\`\`json
${resp.response}
\`\`\``;
        }
      }
    }
    if (result === ``) {
      return { passed: true, markdown: `Test passed` };
    }
    return { passed: false, markdown: `#### Test failed:\n\n\n${result}` };
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
