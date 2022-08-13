import { performance } from "perf_hooks";
import { Caller } from "./caller";
import { Message, Parser, Proto, ProtoType } from "./parser";

export class Grpcurl {
  constructor(
    private parser: Parser,
    private caller: Caller,
    public useDocker: boolean
  ) {}

  async protoFile(input: ProtoFileInput): Promise<ProtoFile | string> {
    const command = `grpcurl |SRC| describe`;
    const call = this.caller.formSource({
      call: command,
      source: input.path,
      server: false,
      plaintext: false,
      docker: this.useDocker,
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
      call: command,
      source: input.host,
      server: true,
      plaintext: input.plaintext,
      docker: this.useDocker,
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
      call: command,
      source: input.source,
      server: input.server,
      plaintext: input.plaintext,
      docker: this.useDocker,
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
    for (const metafield of input.metadata) {
      meta = meta + this.headerPreprocess(metafield);
    }

    const call = this.caller.formSource({
      call: command,
      source: input.host.adress,
      server: true,
      plaintext: input.host.plaintext,
      docker: this.useDocker,
      args: [meta, maxMsgSize, formedJson, input.callTag],
      importPath: ``,
    });

    return call;
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
    response.time = `${Math.round(end - start) / 1000}s`;
    return response;
  }

  async test(input: RequestData): Promise<string> {
    let markdownTestResult: string = ``;
    const resp = await this.send(input);
    if (resp.code !== input.expectedCode) {
      markdownTestResult += `- Code not matches: ${resp.code} vs ${input.expectedCode}\n`;
    }
    let expectedTime: number;
    if (input.expectedTime.endsWith(`s`)) {
      expectedTime = +input.expectedTime.substring(
        0,
        input.expectedTime.length - 1
      );
    } else {
      const expectedTimeInminutes = +input.expectedTime.substring(
        0,
        input.expectedTime.length - 1
      );
      expectedTime = expectedTimeInminutes * 60;
    }
    const actualTime: number = +resp.time.substring(0, resp.time.length - 1);
    if (actualTime > expectedTime) {
      markdownTestResult += `- Time not matches: ${resp.time} vs ${expectedTime}s\n`;
    }
    if (resp.response !== input.expectedResponse) {
      markdownTestResult += `- Response is not matching`;
    }
    return markdownTestResult;
  }

  private jsonPreprocess(input: string): string {
    input = JSON.stringify(JSON.parse(input));
    if (process.platform === "win32") {
      input = input.replaceAll('"', '\\"');
      return `"${input}"`;
    }
    return `'${input}'`;
  }

  private headerPreprocess(header: string): string {
    if (process.platform === "win32") {
      return `-H "${header}" `;
    }
    return `-H '${header}' `;
  }
}

export interface ProtoFileInput {
  path: string;
  importPath: string;
  hosts: Host[];
}

export interface Host {
  adress: string;
  plaintext: boolean;
}

export interface ProtoFile extends Proto {
  path: string;
  importPath: string;
  hosts: Host[];
}

export interface ProtoServerInput {
  host: string;
  plaintext: boolean;
}

export interface ProtoServer extends Proto {
  adress: string;
  plaintext: boolean;
}

export interface Request {
  path: string;
  importPath: string;
  json: string;
  host: Host;
  callTag: string;
  maxMsgSize: number;
  metadata: string[];
}

export interface Response {
  code: string;
  response: string;
  time: string;
  date: string;
}

export interface RequestData extends Request, Response {
  service: string;
  call: string;
  inputMessageTag: string;
  inputMessageName: string;
  outputMessageName: string;
  protoName: string;
  hosts: Host[];
  expectedResponse: string;
  expectedCode: string;
  expectedTime: string;
  testPassed: boolean | undefined;
  testMdResult: string;
}
