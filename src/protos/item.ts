import * as vscode from "vscode";
import * as path from "path";
import { Service } from "../classes/service";
import { Proto } from "../classes/proto";
import { Message } from "../classes/message";
import { Call } from "../classes/call";
import { Field } from "../classes/field";
import { Input } from "../webview/input";

export class ProtoItem extends vscode.TreeItem {
  constructor(public item: Proto | Service | Call | Message | Field) {
    super(item.name);
    super.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    let svg = "";
    if (item instanceof Proto) {
      super.tooltip = "Parsed proto schema definition";
      svg = "proto.svg";
    }
    if (item instanceof Service) {
      super.tooltip = "gRPC service";
      svg = "svc.svg";
    }
    if (item instanceof Call) {
      super.collapsibleState = vscode.TreeItemCollapsibleState.None;
      if (item.inputIsStream || item.outputIsStream) {
        super.tooltip = "gRPC stream (NOT SUPPORTED YET)";
        svg = "stream.svg";
      } else {
        super.tooltip = "gRPC unary call";
        svg = "unary.svg";
      }
      super.contextValue = "call";
      let isStream = item.inputIsStream || item.outputIsStream;
      super.command = {
        command: "call.trigger",
        title: "Trigger opening of webview for grpc call",
        arguments: [
          new Input(
            item.proto.shortName,
            item.proto.version,
            item.service,
            item.name,
            `to fill`,
            item.input.name,
            item.output.name,
            item.input.representation(),
            isStream
          ),
        ],
      };
    }
    if (item instanceof Message) {
      super.tooltip = "User defined gRPC message from schema";
      super.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
      svg = "msg.svg";
    }
    if (item instanceof Field) {
      super.tooltip = "Field in gRPC message";
      super.collapsibleState = vscode.TreeItemCollapsibleState.None;
      svg = "field.svg";
    }
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", svg),
      dark: path.join(__filename, "..", "..", "images", svg),
    };
  }
}
