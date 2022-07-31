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
    const proto = this.parser.proto(resp);
    return [proto, null];
  }

  async message(path: string, tag: string): Promise<[Message, Error]> {
    const call = `grpcurl -import-path / -proto %s describe %s`;
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
    const inputRequest = this.systemInputPreprocess(`'${input.reqJson}'`);
    let tls = ``;
    if (input.tlsOn) {
      tls = `-plaintext `;
    }
    let maxMsgSize = ``;
    if (maxMsgSize !== null) {
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
      input.method,
    ]);
    var endTime = performance.now();
    let response: Response;
    if (err !== null) {
      response = this.parser.resp(err.message);
    } else {
      response = this.parser.resp(resp);
    }
    response.time = `${endTime - startTime}`;
    return response;
  }

  private systemInputPreprocess(input: string): string {
    input = input.replaceAll("\n", "");
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
  method: string;
  tlsOn: boolean;
  metadata: string[];
  maxMsgSize: number;
}

export interface Response {
  code: string;
  json: string;
  time: string;
  message: string;
}
