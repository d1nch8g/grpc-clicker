import * as vscode from "vscode";
import * as path from "path";
import { Service } from "../classes/service";
import { Proto } from "../classes/proto";
import { Message } from "../classes/message";
import { Call } from "../classes/call";
import { Field } from "../classes/field";

export class ProtoItem extends vscode.TreeItem {
  constructor(public item: Proto | Service | Call | Message | Field) {
    super(item.name);
    super.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    let svg = "";
    if (item instanceof Proto) {
      svg = "proto.svg";
    }
    if (item instanceof Service) {
      svg = "svc.svg";
    }
    if (item instanceof Call) {
      super.collapsibleState = vscode.TreeItemCollapsibleState.None;
      if (item.inputIsStream || item.outputIsStream) {
        svg = "stream.svg";
      } else {
        svg = "unary.svg";
      }
      super.contextValue = "call";
      super.command = {
        command: "call.trigger",
        title: "Trigger opening of webview for grpc call",
        arguments: [item.path, item.tag],
      };
    }
    if (item instanceof Message) {
      super.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
      svg = "msg.svg";
    }
    if (item instanceof Field) {
      super.collapsibleState = vscode.TreeItemCollapsibleState.None;
      svg = "field.svg";
    }
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", "light", svg),
      dark: path.join(__filename, "..", "..", "images", "dark", svg),
    };
  }
}
