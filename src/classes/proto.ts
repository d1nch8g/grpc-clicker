import { Message } from "./message";
import { Service } from "./service";

export class Proto {
  public name: string;
  public shortName: string;
  public tag: string;
  public version: string;
  public services: Service[] = [];
  public messages: Message[] = [];
  constructor(stdout: string, public path: string) {
    if (stdout === "") {
      this.tag = "failed to load";
    }
    let lines = stdout.split("\n");
    let curLines: string[] = [];
    for (const line of lines) {
      curLines.push(line);
      if (line.endsWith(" is a service:")) {
        this.tag = line.replace(" is a service:", "");
        if (this.tag.includes(".")) {
          let splitted = line.split(".");
          splitted.pop();
          this.tag = splitted.join(".");
          let splittedTag = this.tag.split(".");
          if (splittedTag.length === 2) {
            this.version = splittedTag[1];
          }
        }
      }
      if (line.endsWith("}")) {
        this.services.push(new Service(curLines, this));
        curLines = [];
      }
    }
    let splittedName = this.tag.split(".");
    let filename = path.replace(/^.*[\\\/]/, "");
    if (splittedName.length === 2) {
      this.name = `${filename} - ${splittedName[0]} - ${splittedName[1]}`;
    } else {
      this.name = `${filename} - ${splittedName[0]}`;
    }
    this.shortName = splittedName[0];
    let messages = new Map<string, Message>();
    for (const service of this.services) {
      for (const call of service.calls) {
        messages.set(call.input.tag, call.input);
        messages.set(call.output.tag, call.output);
      }
    }
    messages.forEach((msg) => {
      this.messages.push(msg);
    });
  }
}
