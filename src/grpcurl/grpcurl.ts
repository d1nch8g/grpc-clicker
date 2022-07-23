import * as vscode from "vscode";
import { Field } from "../classes/field";
import { Message } from "../classes/message";
import { Proto } from "../classes/proto";
import { Storage } from "../storage/storage";

export class Grpcurl {
  constructor(private storage: Storage) {}

  async proto(path: string): Promise<Proto> {
    try {
      const util = require("util");
      const exec = util.promisify(require("child_process").exec);
      const call = `grpcurl -import-path / -proto ${path} describe`;
      const { stdout, stderr } = await exec(call);
      if (`${stderr}` !== ``) {
        vscode.window.showErrorMessage(`${stderr}`);
        return new Proto("", path);
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
  async sendCall(
    path: string,
    req: string,
    adress: string,
    method: string,
    tlsOn: boolean
  ): Promise<string> {
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
        metadata = metadata + `-H ${this.inputPreprocess(meta)} `;
      }

      const call = `grpcurl ${metadata} -import-path / -proto ${path} -d ${this.inputPreprocess(
        req
      )} ${tls} ${adress} ${method}`;
      const { stdout, stderr } = await exec(call);
      if (`${stderr}` !== "") {
        return `${stderr}`;
      }
      return `${stdout}`;
    } catch (e) {
      return `${e}`;
    }
  }
  inputPreprocess(input: string): string {
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
