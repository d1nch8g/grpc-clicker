import * as vscode from "vscode";
import * as path from "path";

export class CallItem extends vscode.TreeItem {
  constructor(public readonly label: string, isStream: boolean) {
    super(label);
    super.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    let fileName = "unary.svg";
    if (isStream) {
      fileName = "stream.svg";
    }
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", "light", fileName),
      dark: path.join(__filename, "..", "..", "images", "dark", fileName),
    };
  }
}
