import * as vscode from "vscode";
import { Message } from "./message";
import { Service } from "./service";

export class Proto {
  public name: string;
  public tag: string;
  public version: string;
  public built: boolean = false;
  public services: Service[] = [];
  public messages: Message[] = [];
  constructor(stdout: string, public path: string) {
    let lines = stdout.split("\n");
    let curLines: string[] = [];
    lines.forEach((line) => {
      curLines.push(line);
      if (line.endsWith(" is a service:")) {
        this.tag = line.replace(" is a service:", "");
        if (this.tag.includes(".")) {
          let splitted = line.split(".");
          splitted.pop();
          this.tag = splitted.join(".");
        }
      }
      if (line.endsWith("}")) {
        this.services.push(new Service(curLines, path));
        curLines = [];
      }
    });
    let splittedName = this.tag.split(".");
    if (splittedName.length === 2) {
      this.name = splittedName[0];
      this.version = splittedName[1];
    } else {
      this.name = splittedName[0];
      this.version = "";
    }
    this.services.forEach((service) => {
      service.calls.forEach((call) => {
        this.messages.push(call.input);
        this.messages.push(call.output);
      });
    });
  }
}
