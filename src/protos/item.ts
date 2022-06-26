import * as vscode from "vscode";
import * as path from "path";
import { Service } from "../grpcurl/service";
import { Proto } from "../grpcurl/proto";
import { Message } from "../grpcurl/message";
import { Call } from "../grpcurl/call";
import { Field } from "../grpcurl/field";

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
      if (item.inputIsStream || item.outputIsStream) {
        svg = "stream.svg";
      } else {
        svg = "unary.svg";
      }
    }
    if (item instanceof Message) {
      svg = "msg.svg";
    }
    if (item instanceof Field) {
      svg = "";
    }
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", "light", svg),
      dark: path.join(__filename, "..", "..", "images", "dark", svg),
    };
  }
}
