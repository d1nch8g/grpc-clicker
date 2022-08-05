import { performance } from "perf_hooks";
import { Caller } from "./caller";
import { Message, Parser, Proto } from "./parser";

export class Grpcurl {
  constructor(private parser: Parser, private caller: Caller) {}

  async proto(path: string): Promise<[Proto, Error]> {
    const call = `grpcurl -import-path / -proto %s describe`;
    const [resp, err] = await this.caller.execute(call, [path]);
    if (err !== null) {
      return [null, err];
    }
    const proto = this.parser.proto(resp, path);
    return [proto, null];
  }

  async message(path: string, tag: string): Promise<[Message, Error]> {
    const call = `grpcurl -msg-template -import-path / -proto %s describe %s`;
    const [resp, err] = await this.caller.execute(call, [path, tag]);
    if (err !== null) {
      return [null, err];
    }
    const msg = this.parser.message(resp);
    return [msg, null];
  }

  async send(input: Request): Promise<Response> {
    const call = `grpcurl %s %s -import-path / -proto %s -d %s %s %s %s`;
    let meta = ``;
    for (const metafield of input.metadata) {
      meta = meta + `-H '${metafield}' `;
    }
    const inputRequest = this.inputPreprocess(input.reqJson);
    let tls = ``;
    if (!input.tlsOn) {
      tls = `-plaintext `;
    }
    let maxMsgSize = ``;
    if (input.maxMsgSize !== null) {
      maxMsgSize = `-max-msg-sz ${input.maxMsgSize}`;
    }
    var startTime = performance.now();
    const [resp, err] = await this.caller.execute(call, [
      meta,
      maxMsgSize,
      input.path,
      inputRequest,
      tls,
      input.host,
      input.call,
    ]);
    var endTime = performance.now();
    let response: Response;
    if (err !== null) {
      response = this.parser.resp(err.message);
    } else {
      response = this.parser.resp(resp);
    }
    response.date = new Date().toUTCString();
    response.time = `${(endTime - startTime) / 1000}s`;
    return response;
  }

  inputPreprocess(input: string): string {
    input = JSON.stringify(JSON.parse(input));
    if (process.platform === "win32") {
      input = input.replaceAll('"', '\\"');
      input = `"${input}"`;
    } else {
      input = `'${input}'`;
    }
    return input;
  }
}

export interface Request {
  path: string;
  reqJson: string;
  host: string;
  call: string;
  tlsOn: boolean;
  metadata: string[];
  maxMsgSize: number;
}

export interface Response {
  code: string;
  respJson: string;
  time: string;
  date: string;
  errmes: string;
}
