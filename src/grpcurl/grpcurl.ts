import { performance } from "perf_hooks";
import { Caller } from "./caller";
import { Message, Parser, Proto, ProtoType } from "./parser";
import * as util from "util";

export class Grpcurl {
  constructor(
    private parser: Parser,
    private caller: Caller,
    public useDocker: boolean
  ) {}

  async proto(path: string): Promise<Proto> {
    let call = `grpcurl -import-path / -proto %s describe`;
    call = util.format(call, path);

    if (this.useDocker) {
      call = this.dockerize(call);
    }

    const [resp, err] = await this.caller.execute(call);
    if (err !== undefined) {
      return {
        type: ProtoType.proto,
        name: "",
        path: "",
        services: [],
        error: err.message,
      };
    }
    const proto = this.parser.proto(resp, path);
    return proto;
  }

  async message(path: string, tag: string): Promise<Message> {
    let call = `grpcurl -msg-template -import-path / -proto %s describe %s`;
    call = util.format(call, path, tag);

    if (this.useDocker) {
      call = this.dockerize(call);
    }

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

  formGrpcurlCommand(input: Request): string {
    let call = `grpcurl %s %s -import-path / -proto %s -d %s %s %s %s`;
    let meta = ``;
    for (const metafield of input.metadata) {
      meta = meta + this.headerPreprocess(metafield);
    }
    const inputRequest = this.jsonPreprocess(input.reqJson);
    let plaintext = ``;
    if (input.plaintext) {
      plaintext = `-plaintext `;
    }
    let maxMsgSize = `-max-msg-sz ${input.maxMsgSize * 1048576}`;

    call = util.format(
      call,
      meta,
      maxMsgSize,
      input.path,
      inputRequest,
      plaintext,
      input.host,
      input.call
    );

    if (this.useDocker) {
      call = this.dockerize(call);
    }
    return call;
  }

  async send(input: Request): Promise<Response> {
    var startTime = performance.now();
    const [resp, err] = await this.caller.execute(
      this.formGrpcurlCommand(input)
    );

    var endTime = performance.now();
    let response: Response;
    if (err !== undefined) {
      response = this.parser.resp(err.message);
    } else {
      response = this.parser.resp(resp);
    }
    response.date = new Date().toUTCString();
    response.time = `${Math.round(endTime - startTime) / 1000}s`;
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

  async checkInstalled(): Promise<boolean> {
    const [resp, err] = await this.caller.execute(`grpcurls -help`);
    if (err !== undefined) {
      return false;
    }
    return true;
  }

  dockerize(input: string): string {
    if (!input.includes(`-proto `)) {
      return input.replace(`grpcurl `, `docker run fullstorydev/grpcurl `);
    }
    if (process.platform === "win32") {
      const protoSplitted = input.split(`-proto `)[1];
      const windowsPath = protoSplitted.split(` `)[0];
      const linuxPath = windowsPath.split(`:`)[1];
      input = input.replace(windowsPath, linuxPath);
      return input.replace(
        `grpcurl `,
        `docker run -v ${windowsPath}:${linuxPath} fullstorydev/grpcurl `
      );
    }
    const path = input.split(`-proto `)[1].split(` `)[0];
    return input.replace(
      `grpcurl `,
      `docker run -v ${path}:${path} fullstorydev/grpcurl `
    );
  }
}

export interface Request {
  path: string;
  reqJson: string;
  host: string;
  call: string;
  plaintext: boolean;
  metadata: string[];
  maxMsgSize: number;
}

export interface Response {
  code: string;
  respJson: string;
  time: string;
  date: string;
  errmes: string | undefined;
}
