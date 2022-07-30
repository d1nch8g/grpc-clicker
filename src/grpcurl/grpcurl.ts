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

  async message(path: string, msgTag: string): Promise<Message> {
    const call = `grpcurl -import-path / -proto %s describe %s`;
    this.caller.execute(call, [path, msgTag]);
  }

  async send(
    path: string,
    req: string,
    host: string,
    method: string,
    tlsOn: boolean
  ): Promise<[string, string]> {
    try {
      const util = require("util");
      const exec = util.promisify(require("child_process").exec);
      let tls = ``;
      if (!tlsOn) {
        tls = `-plaintext `;
      }

      let metadata = ``;
      const metas = this.storage.metas.listActive();
      for (const meta of metas) {
        metadata = metadata + `-H ${this.systemInputPreprocess(meta)} `;
      }

      const requset = this.systemInputPreprocess(req);

      const call = `grpcurl ${metadata} -import-path / -proto ${path} -d ${requset} ${tls} ${host} ${method}`;
      const { stdout, stderr } = await exec(call);
      if (`${stderr}` !== "") {
        return [``, `${stderr}`];
      }
      return [`${stdout}`, ``];
    } catch (exception) {
      return [``, `${exception}`];
    }
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
