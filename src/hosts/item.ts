import * as vscode from "vscode";
import * as path from "path";

export class AdressItem extends vscode.TreeItem {
  constructor(public readonly label: string) {
    super(label);
  }

  iconPath = {
    light: path.join(__filename, "..", "..", "images", "light", "host.svg"),
    dark: path.join(__filename, "..", "..", "images", "dark", "host.svg"),
  };

  contextValue = "gRPC Item";
}
