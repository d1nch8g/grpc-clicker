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

  async protoFile(input: ProtoFileInput): Promise<ProtoFile | string> {
    const command = `grpcurl |SRC| describe`;
    const call = this.caller.form({
      call: command,
      source: input.path,
      server: false,
      plaintext: false,
      docker: this.useDocker,
      args: [],
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
      name: parsedProto.name,
      services: parsedProto.services,
    };
  }

  async protoServer(input: ProtoServerInput): Promise<ProtoServer | string> {
    const command = `grpcurl |SRC| describe`;
    const call = this.caller.form({
      call: command,
      source: input.host,
      server: true,
      plaintext: input.plaintext,
      docker: this.useDocker,
      args: [],
    });
    const [output, err] = await this.caller.execute(call);
    if (err !== undefined) {
      return err.message;
    }
    const parsedProto = this.parser.proto(output);
    return {
      type: ProtoType.proto,
      host: input.host,
      plaintext: input.plaintext,
      name: parsedProto.name,
      services: parsedProto.services,
    };
  }

  async message(input: {
    source: string;
    server: boolean;
    plaintext: boolean;
    tag: string;
  }): Promise<Message | string> {
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
      return err.message;
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

export interface ProtoFileInput {
  path: string;
  hosts: string[];
}

export interface ProtoFile extends Proto {
  path: string;
  hosts: string[];
}

export interface ProtoServerInput {
  host: string;
  plaintext: boolean;
}

export interface ProtoServer extends Proto {
  host: string;
  plaintext: boolean;
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
}
