import * as vscode from "vscode";
import * as path from "path";
import { Service, Call, ProtoType, Message, Field } from "../grpcurl/parser";
import { ProtoFile } from "../grpcurl/grpcurl";
import { RequestHistoryData } from "../storage/history";

export enum ItemType {
  unknown,
  file,
  hosts,
  host,
  service,
  call,
  message,
  field,
}

export class ClickerItem extends vscode.TreeItem {
  public type: ItemType = ItemType.unknown;
}

export class FileItem extends ClickerItem {
  constructor(public readonly base: ProtoFile) {
    super(base.name);
    super.type = ItemType.file;
    super.description = base.path.replace(/^.*[\\\/]/, "");
    super.tooltip = base.path;
    super.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    const icon = `file.svg`;
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", icon),
      dark: path.join(__filename, "..", "..", "images", icon),
    };
  }
}

export class HostsItem extends ClickerItem {
  constructor(
    public readonly hosts: string[],
    public readonly parent: FileItem
  ) {
    super(`hosts`);
    super.type = ItemType.hosts;
    super.tooltip = `Hosts for gRPC calls for current file.`;
    super.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    const icon = `field.svg`;
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", icon),
      dark: path.join(__filename, "..", "..", "images", icon),
    };
  }
}

export class HostItem extends ClickerItem {
  constructor(public readonly host: string, public readonly parent: HostsItem) {
    super(host);
    super.type = ItemType.host;
    const icon = `host-off.svg`;
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", icon),
      dark: path.join(__filename, "..", "..", "images", icon),
    };
    super.collapsibleState = vscode.TreeItemCollapsibleState.None;
  }
}

export class ServiceItem extends ClickerItem {
  constructor(public readonly base: Service, public readonly parent: FileItem) {
    super(base.name);
    super.type = ItemType.service;
    const icon = `svc.svg`;
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", icon),
      dark: path.join(__filename, "..", "..", "images", icon),
    };
    super.tooltip = base.description;
    super.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
  }
}

export class CallItem extends ClickerItem {
  constructor(public readonly base: Call, public readonly parent: ServiceItem) {
    super(base.name);
    super.type = ItemType.call;
    let icon = "unary.svg";
    if (base.inputStream || base.outputStream) {
      icon = "stream.svg";
    }
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", icon),
      dark: path.join(__filename, "..", "..", "images", icon),
    };
    super.tooltip = base.description;
    super.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    super.contextValue = "call";
    let request: RequestData = {
      path: parent.parent.base.path,
      protoName: parent.parent.base.name,
      service: parent.base.name,
      call: base.name,
      inputMessageTag: base.inputMessageTag,
      inputMessageName: base.inputMessageTag.split(`.`).pop()!,
      outputMessageName: base.outputMessageTag.split(`.`).pop()!,
      plaintext: true,
      host: "",
      json: "",
      maxMsgSize: 0,
      code: "",
      response: "",
      time: "",
      date: "",
      errmes: "",
      metadata: [],
      hosts: [],
    };
    super.command = {
      command: "webview.open",
      title: "Trigger opening of webview for grpc call",
      arguments: [request],
    };
  }
}

export class MessageItem extends ClickerItem {
  constructor(public readonly base: Message) {
    super(base.name);
    super.type = ItemType.message;
    const icon = `msg.svg`;
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", icon),
      dark: path.join(__filename, "..", "..", "images", icon),
    };
    super.tooltip = base.description;
    super.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
  }
}

export class FieldItem extends ClickerItem {
  constructor(public readonly base: Field) {
    super(base.name);
    super.type = ItemType.field;
    super.tooltip = base.description;
    super.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    if (base.fields === undefined || base.fields.length === 0) {
      super.collapsibleState = vscode.TreeItemCollapsibleState.None;
    }
    const icon = `field.svg`;
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", icon),
      dark: path.join(__filename, "..", "..", "images", icon),
    };
  }
}

export interface RequestData extends RequestHistoryData {
  protoName: string;
  hosts: string[];
}
