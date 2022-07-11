import * as vscode from "vscode";
import * as path from "path";

export class HostItem extends vscode.TreeItem {
  constructor(host: string) {
    super(host);
    super.tooltip = `Host for making gRPC calls.`;
    super.contextValue = "host";
    super.command = {
      command: "hosts.switch",
      title: "Switch grpc host",
      arguments: [host],
    };
  }
  iconPath = {
    light: path.join(__filename, "..", "..", "images", "host.svg"),
    dark: path.join(__filename, "..", "..", "images", "host.svg"),
  };
}
