import * as vscode from "vscode";
import { Field } from "./field";
import { Proto } from "./proto";

export class Grpcurl {
  async proto(path: string): Promise<Proto> {
    const util = require("util");
    const exec = util.promisify(require("child_process").exec);
    const call = `grpcurl -import-path / -proto ${path} describe`;
    const { stdout, stderr } = await exec(call);
    if (`${stderr}` !== ``) {
      vscode.window.showErrorMessage(`${stderr}`);
      return null;
    }
    return new Proto(`${stdout}`, path);
  }
  async message(path: string, tag: string): Promise<Field[]> {
    return null;
  }
}
