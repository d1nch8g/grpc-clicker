import * as vscode from "vscode";
import * as path from "path";
import { Service } from "../grpcurl/service";
import { Proto } from "../grpcurl/proto";
import { Message } from "../grpcurl/message";
import { Call } from "../grpcurl/call";

export enum ProtoType {
  proto,
  service,
  unary,
  stream,
  message,
  field,
}

export class ProtoItem extends vscode.TreeItem {
  public type: ProtoType;
  constructor(public readonly item: Proto | Service | Call | Message) {
    super(item.name);
    super.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    let svg = "";
    if (item instanceof Proto) {
      this.type = ProtoType.proto;
      svg = "proto.svg";
    }
    if (item instanceof Service) {
      this.type = ProtoType.service;
      svg = "svc.svg";
    }
    if (item instanceof Call) {
      if (item.inputIsStream || item.outputIsStream) {
        this.type = ProtoType.stream;
        svg = "stream.svg";
      } else {
        this.type = ProtoType.unary;
        svg = "msg.svg";
      }
    }
    if (item instanceof Message) {
      this.type = ProtoType.message;
      svg = "svc.svg";
    }
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", "light", svg),
      dark: path.join(__filename, "..", "..", "images", "dark", svg),
    };
  }
}
