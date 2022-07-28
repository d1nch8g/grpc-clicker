import { Message } from "./message";
import { Service } from "./service";

export class Proto {
  public name: string;
  public filename: string;
  public services: Service[] = [];
  public messages: Message[] = [];
  constructor(stdout: string, public path: string) {
    if (stdout === "") {
      this.name = "failed to load";
    }
    let lines = stdout.split("\n");
    let curLines: string[] = [];
    for (const line of lines) {
      curLines.push(line);
      if (line.endsWith(" is a service:")) {
        this.name = line.replace(" is a service:", "");
        if (this.name.includes(".")) {
          let splitted = line.split(".");
          splitted.pop();
          this.name = splitted.join(".");
        }
      }
      if (line.endsWith("}")) {
        this.services.push(new Service(curLines, this));
        curLines = [];
      }
    }
    this.filename = path.replace(/^.*[\\\/]/, "");
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
