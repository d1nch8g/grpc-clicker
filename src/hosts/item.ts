import * as vscode from "vscode";
import * as path from "path";

export class HostItem extends vscode.TreeItem {
  constructor(host: string, current: boolean) {
    super(host);
    super.tooltip = `Host for making gRPC calls.`;
    super.contextValue = "host";
    super.command = {
      command: "hosts.switch",
      title: "Switch grpc host",
      arguments: [host],
    };
    let img = "host-off.svg";
    if (current) {
      img = "host-on.svg";
    }
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", img),
      dark: path.join(__filename, "..", "..", "images", img),
    };
  }
}
