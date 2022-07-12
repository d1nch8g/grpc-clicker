import * as vscode from "vscode";
import * as path from "path";

export class MetaItem extends vscode.TreeItem {
  private iconName = "meta-off.svg";
  constructor(meta: string, isOn: boolean) {
    super(meta);
    super.tooltip = `Meta data that will be sent with request in context`;
    super.contextValue = "meta";
    super.command = {
      command: "metas.switch",
      title: "Switch grpc host",
      arguments: [meta],
    };
    if (isOn) {
      this.iconName = "meta-on.svg";
    }
    this.iconPath = {
      light: path.join(__filename, "..", "..", "images", this.iconName),
      dark: path.join(__filename, "..", "..", "images", this.iconName),
    };
  }
}
