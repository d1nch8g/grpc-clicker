import * as fs from "fs";
import * as vscode from "vscode";
import * as path from "path";

export class AdressItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
  }

  iconPath = {
    light: path.join(__filename, "..", "..", "images", "light", "host.svg"),
    dark: path.join(__filename, "..", "..", "images", "dark", "host.svg"),
  };

  contextValue = "gRPC Item";
}
