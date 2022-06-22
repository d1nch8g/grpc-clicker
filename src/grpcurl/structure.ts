import { spawn } from "child_process";
import { Message } from "./message";
import { Service } from "./service";

export class Structure {
  public error: string;
  public name: string;
  public fullName: string;
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
    grpcurl.stderr.on("data", (data) => {
      this.error = data as string;
    });
    grpcurl.stdout.on("data", (data) => {
      let out = data as string;
      let lines = out.split("\n");
      lines.forEach((line) => {
        if (line.endsWith(" is a service:")) {
          this.fullName = line.replace(" is a service:", "");
          if (this.fullName.includes(".")) {
            let splitted = line.split(".");
          }
        }
      });
    });
  }
}
