import { Call } from "./call";

export class Service {
  public name: string;
  public tag: string;
  public calls: Call[] = [];
  constructor(lines: string[], public path: string) {
    this.tag = lines[0].split(" ")[0];
    let splittedtag = this.tag.split(".");
    this.name = splittedtag[splittedtag.length - 1];
    for (const line of lines) {
      if (line.startsWith("  rpc")) {
        this.calls.push(new Call(line, path, this.tag));
      }
    }
  }
}
