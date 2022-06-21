import { spawn } from "child_process";

function getSchema(path: string): [string, string] {
  let grpcurl = spawn("grpcurl", [
    "-import-path",
    "/",
    "-proto",
    path,
    "describe",
  ]);
  let res = <string>grpcurl.stderr.read();
  return ["", ""];
}
