import { Message, Parser, Proto, ProtoType, Response } from "./parser";
import { Caller } from "./caller";
import { performance } from "perf_hooks";

export class Grpcurl {
  constructor(
    private parser: Parser,
    private caller: Caller,
    public useDocker: boolean
  ) {}

  async protoFile(input: ProtoFileInput): Promise<ProtoFile | string> {
    const command = `grpcurl |SRC| describe`;
    const call = this.caller.formSource({
      cliCommand: command,
      source: input.path,
      server: false,
      plaintext: false,
      useDocker: this.useDocker,
      args: [],
      importPath: input.importPath,
    });
    const [output, err] = await this.caller.execute(call);
    if (err !== undefined) {
      return err.message;
    }
    const parsedProto = this.parser.proto(output);
    return {
      type: ProtoType.proto,
      path: input.path,
      hosts: input.hosts,
      importPath: input.importPath,
      services: parsedProto.services,
    };
  }

  async protoServer(input: ProtoServerInput): Promise<ProtoServer | string> {
    const command = `grpcurl -max-time 0.5 |SRC| describe`;
    const call = this.caller.formSource({
      cliCommand: command,
      source: input.host,
      server: true,
      plaintext: input.plaintext,
      useDocker: this.useDocker,
      args: [],
      importPath: ``,
    });
    const [output, err] = await this.caller.execute(call);
    if (err !== undefined) {
      return err.message;
    }
    const parsedProto = this.parser.proto(output);
    return {
      type: ProtoType.proto,
      adress: input.host,
      plaintext: input.plaintext,
      services: parsedProto.services,
    };
  }

  async message(input: {
    source: string;
    server: boolean;
    plaintext: boolean;
    tag: string;
    importPath: string;
  }): Promise<Message | string> {
    let command = `grpcurl -msg-template |SRC| describe %s`;

    const call = this.caller.formSource({
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
      return this.caller.formSource({
        cliCommand: command,
        source: input.host.adress,
        server: true,
        plaintext: input.host.plaintext,
        useDocker: this.useDocker,
        args: [meta, maxMsgSize, formedJson, input.callTag],
        importPath: ``,
      });
    }
    return this.caller.formSource({
      cliCommand: command,
      source: `${input.path} ${input.host.adress}`,
      server: false,
      plaintext: input.host.plaintext,
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

// Parameters required to parse schema from proto file
export interface ProtoFile extends Proto {
  path: string;
  importPath: string;
}

// Parameters required to parse schema from remote source
export interface ProtoServer extends Proto {
  adress: string;
  plaintext: boolean;
}

// Parameters required to execute gRPC call
export interface Request {
  // Optional parameter that will be used to form message if provided
  file: ProtoFile | undefined;
  // Optional parameter that will be used to form message if provided
  json: string;
  host: string;
  plaintext: string;
  callTag: string;
  maxMsgSize: number;
  headers: string[];
}

export interface TestRequest extends Request {
  expectedCode: string;
  expectedTime: number;
  expectedResponse: string;
}

export interface TestResult {
  passed: boolean;
  markdown: string;
}
