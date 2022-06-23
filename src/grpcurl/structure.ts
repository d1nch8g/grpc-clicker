import * as vscode from "vscode";
import { spawn } from "child_process";
import { Service } from "./service";

export class Structure {
  public name: string;
  public fullName: string;
  public version: string;
  public services: Service[];
  constructor(public path: string) {
    let grpcurl = spawn("grpcurl", [
      "-import-path",
      "/",
      "-proto",
      path,
      "describe",
    ]);
    grpcurl.stderr.on("data", (data) => {
      vscode.window.showErrorMessage(`${data}`);
    });
    grpcurl.stdout.on("data", (data) => {
      let str = `${data}`;
      console.log(`building from string:`);
      let lines = str.split("\n");
      lines.forEach((line) => {
        if (line.endsWith(" is a service:")) {
          this.fullName = line.replace(" is a service:", "");
          if (this.fullName.includes(".")) {
            let splitted = line.split(".");
            splitted.pop();
            this.fullName = splitted.join(".");
          }
        }
      });
    });
  }
}
