import * as vscode from "vscode";
import * as path from "path";

export class ProtoItem extends vscode.TreeItem {
  constructor(public readonly label: string) {
    super(label);
    super.tooltip = ``;
    super.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
  }
  iconPath = {
    light: path.join(__filename, "..", "..", "images", "light", "host.svg"),
    dark: path.join(__filename, "..", "..", "images", "dark", "host.svg"),
  };
}
