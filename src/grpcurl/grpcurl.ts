import * as vscode from "vscode";
import { Field } from "../classes/field";
import { Message } from "../classes/message";
import { Proto } from "../classes/proto";

export class Grpcurl {
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
      return new Proto(`${stdout}`, path);
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
}
