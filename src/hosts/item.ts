import * as vscode from "vscode";
import * as path from "path";

export class HostItem extends vscode.TreeItem {
  constructor(public readonly label: string) {
    super(label);
    super.contextValue = "host";
    super.command = {
      command: "host.switch",
      title: "Switch grpc host",
      arguments: [label],
    };
  }
  iconPath = {
    light: path.join(__filename, "..", "..", "images", "light", "host.svg"),
    dark: path.join(__filename, "..", "..", "images", "dark", "host.svg"),
  };
}
