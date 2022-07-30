import { Field } from "../classes/field";
import { Message } from "../classes/message";
import { Proto } from "../classes/proto";
import { Storage } from "../storage/storage";

export class Grpcurl {
  constructor(private storage: Storage) {}

  async proto(path: string): Promise<[Proto, Error]> {
    try {
      const util = require("util");
      const exec = util.promisify(require("child_process").exec);
      const call = `grpcurl -import-path / -proto ${path} describe`;
      const { stdout, stderr } = await exec(call);
      const stdoutString = `${stdout}`;
      const stderrString = `${stderr}`;
      if (stderrString !== ``) {
        return [null];
      }
      let proto = new Proto(`${stdout}`, path);
      for (const svc of proto.services) {
        for (const call of svc.calls) {
          call.input.fields = await this.getFields(call.input);
          call.output.fields = await this.getFields(call.output);
        }
      }
      return proto;
    } catch (e) {
      vscode.window.showErrorMessage(`${e}`);
      return new Proto("", path);
    }
  }

  async protos(pathes: string[]): Promise<Proto[]> {
    let protos: Proto[] = [];
    for (const path of pathes) {
      protos.push(await this.proto(path));
    }
    return protos;
  }

  async getFields(message: Message): Promise<Field[]> {
    if (message.fields.length > 0) {
      return message.fields;
    }
    const util = require("util");
    const exec = util.promisify(require("child_process").exec);
    const call = `grpcurl -import-path / -proto ${message.path} describe ${message.tag}`;
    const { stdout, stderr } = await exec(call);
    if (`${stderr}` !== ``) {
      vscode.window.showErrorMessage(`${stderr}`);
      return [];
    }
    let lines = `${stdout}`.split("\n");
    for (const line of lines) {
      if (line.includes(" = ") && line.includes(";")) {
        message.fields.push(new Field(line));
      }
    }
    return message.fields;
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
