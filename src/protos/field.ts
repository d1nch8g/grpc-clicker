import * as vscode from "vscode";
import * as path from "path";

export class FieldItem extends vscode.TreeItem {
  constructor(public readonly label: string) {
    super(label);
    super.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    // TODO add icons for each type in protobuf possible :D
  }
}
