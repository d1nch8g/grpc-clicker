import * as vscode from "vscode";
import { Call } from "./call";

export class Service {
  public name: string;
  public tag: string;
  public calls: Call[] = [];
  constructor(lines: string[], public path: string) {
    if (lines.length < 4) {
      vscode.window.showErrorMessage(
        `Unable to create service from lines:\n${lines}`
      );
      return;
    }
    this.tag = lines[0].split(" ")[0];
    let splittedtag = this.tag.split(".");
    this.name = splittedtag[splittedtag.length - 1];
    lines.forEach((line) => {
      if (line.startsWith("  rpc")) {
        this.calls.push(new Call(line, path));
      }
    });
  }
}
