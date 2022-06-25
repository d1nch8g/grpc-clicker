import * as vscode from "vscode";
import { Proto } from "./proto";

export class Grpcurl {
  async getProto(path: string): Promise<Proto> {
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
}
