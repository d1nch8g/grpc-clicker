import { spawn } from "child_process";
import { Message } from "./message";
import { Service } from "./service";

export class Structure {
  public error: string;
  public name: string;
  public version: string;
  public services: Service[];
  public messages: Message[];
  constructor(public path: string) {

    let grpcurl = spawn("grpcurl", [
      "-import-path",
      "/",
      "-proto",
      this.path,
      "describe",
    ]);
    
    this.error = <string>grpcurl.stderr.read();
    let out = <string>grpcurl.stdout.read();
    let lines = out.split("\n");
    lines.forEach((line) => {
      if (line.endsWith(" is a service:")) {
      }
    });
  }
}
