import { stringify } from "querystring";
import * as vscode from "vscode";
import { Message } from "./message";
import { Service } from "./service";

export class Proto {
  public name: string;
  public tag: string;
  public services: Service[] = [];
  public messages: Message[] = [];
  constructor(stdout: string, public path: string) {
    if (stdout === "") {
      this.tag = "failed to load";
    }
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
    let filename = path.replace(/^.*[\\\/]/, "");
    if (splittedName.length === 2) {
      this.name = `${filename} - ${splittedName[0]} - ${splittedName[1]}`;
    } else {
      this.name = `${filename} - ${splittedName[0]}`;
    }
    let messages = new Map<string, Message>();
    this.services.forEach((service) => {
      service.calls.forEach((call) => {
        messages.set(call.input.tag, call.input);
        messages.set(call.output.tag, call.output);
      });
    });
    messages.forEach((message) => {
      this.messages.push(message);
    });
  }
}
