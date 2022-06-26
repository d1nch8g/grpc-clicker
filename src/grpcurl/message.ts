import * as vscode from "vscode";
import { Field } from "./field";

export class Message {
  public name: string;
  public tag: string;
  public fields: Field[] = [];
  constructor(rawmessage: string, public path: string) {
    let splitted = rawmessage.split(" ");
    this.tag = splitted[splitted.length - 2];
    let splittedtag = this.tag.split(".");
    this.name = splittedtag[splittedtag.length - 1];
  }
  async getFields(): Promise<Field[]> {
    if (this.fields.length > 0) {
      return this.fields;
    }
    const util = require("util");
    const exec = util.promisify(require("child_process").exec);
    const call = `grpcurl -import-path / -proto ${this.path} describe ${this.tag}`;
    const { stdout, stderr } = await exec(call);
    if (`${stderr}` !== ``) {
      vscode.window.showErrorMessage(`${stderr}`);
      return [];
    }
    let lines = `${stdout}`.split("\n");
    lines.forEach((line) => {
      if (line.includes(" = ") && line.includes(";")) {
        this.fields.push(new Field(line));
      }
    });
    return this.fields;
  }
}
