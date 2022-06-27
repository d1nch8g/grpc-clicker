import * as vscode from "vscode";
import * as path from "path";

export class HostItem extends vscode.TreeItem {
  constructor(host: string) {
    super(host);
    super.tooltip = `tooltip`;
    super.contextValue = "host";
    super.command = {
      command: "hosts.switch",
      title: "Switch grpc host",
      arguments: [host],
    };
  }
  iconPath = {
    light: path.join(__filename, "..", "..", "images", "light", "host.svg"),
    dark: path.join(__filename, "..", "..", "images", "dark", "host.svg"),
  };
}
