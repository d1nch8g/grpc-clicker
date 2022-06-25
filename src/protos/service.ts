import * as vscode from "vscode";
import * as path from "path";

export class ServiceItem extends vscode.TreeItem {
  constructor(public readonly label: string) {
    super(label);
    super.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", "light", "svc.svg"),
      dark: path.join(__filename, "..", "..", "images", "dark", "svc.svg"),
    };
  }
}
