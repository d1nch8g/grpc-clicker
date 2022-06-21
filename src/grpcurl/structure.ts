import { spawn } from "child_process";

export class Structure {
  error: string;
  constructor(private path: string) {
    let grpcurl = spawn("grpcurl", [
      "-import-path",
      "/",
      "-proto",
      path,
      "describe",
    ]);
    let out = <string>grpcurl.stdout.read();
    let err = <string>grpcurl.stderr.read();
  }
}
