import { performance } from "perf_hooks";
import { Caller, RequestForm } from "./caller";
import { Message, Parser, Proto, ProtoType } from "./parser";
import * as util from "util";

export class Grpcurl {
  constructor(
    private parser: Parser,
    private caller: Caller,
    public useDocker: boolean
  ) {}

  async installed(): Promise<boolean> {
    const [resp, err] = await this.caller.execute(`grpcurls -help`);
    if (err !== undefined) {
      return false;
    }
    return true;
  }

  async proto(input: {
    source: string;
    server: boolean;
    plaintext: boolean;
  }): Promise<Proto> {
    const command = `grpcurl |SRC| describe`;
    const call = this.caller.form({
      call: command,
      source: input.source,
      server: input.server,
      plaintext: input.plaintext,
      docker: this.useDocker,
      args: [],
    });
    const [output, err] = await this.caller.execute(call);
    if (err !== undefined) {
      return {
        type: ProtoType.proto,
        name: ``,
        source: input.source,
        services: [],
        error: err.message,
      };
    }
    return this.parser.proto(output, input.source);
  }

  async message(input: {
    source: string;
    server: boolean;
    plaintext: boolean;
    tag: string;
  }): Promise<Message> {
    let command = `grpcurl -msg-template |SRC| describe %s`;

    const call = this.caller.form({
      call: command,
      source: input.source,
      server: input.server,
      plaintext: input.plaintext,
      docker: this.useDocker,
      args: [input.tag],
    });

    const [resp, err] = await this.caller.execute(call);
    if (err !== undefined) {
      return {
        type: ProtoType.message,
        name: "",
        tag: "",
        description: undefined,
        template: undefined,
        fields: [],
        error: err.message,
      };
    }
    const msg = this.parser.message(resp);
    return msg;
  }

  formCall(input: Request): string {
    const command = `grpcurl %s %s -d %s |SRC| %s`;
    const formedJson = this.jsonPreprocess(input.json);
    const maxMsgSize = `-max-msg-sz ${input.maxMsgSize * 1048576}`;
    let meta = ``;
    for (const metafield of input.metadata) {
      meta = meta + this.headerPreprocess(metafield);
    }

    const call = this.caller.form({
      call: command,
      source: input.host,
      server: true,
      plaintext: input.plaintext,
      docker: this.useDocker,
      args: [meta, maxMsgSize, formedJson, input.call],
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

export interface Request {
  path: string;
  json: string;
  host: string;
  call: string;
  plaintext: boolean;
  metadata: string[];
  maxMsgSize: number;
}

export interface Response {
  code: string;
  response: string;
  time: string;
  date: string;
  errmes: string | undefined;
}
