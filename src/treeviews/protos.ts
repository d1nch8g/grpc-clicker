import * as vscode from "vscode";
import * as path from "path";
import {
  Proto,
  Service,
  Call,
  ProtoType,
  Message,
  Field,
} from "../grpcurl/parser";
import { RequestHistoryData } from "../storage/history";

export class ProtosTreeView implements vscode.TreeDataProvider<ProtoItem> {
  constructor(private protos: Proto[]) {
    this.protos = protos;
    this.onChange = new vscode.EventEmitter<ProtoItem | undefined | void>();
    this.onDidChangeTreeData = this.onChange.event;
  }

  private onChange: vscode.EventEmitter<ProtoItem | undefined | void>;
  readonly onDidChangeTreeData: vscode.Event<void | ProtoItem | ProtoItem[]>;

  async update(protos: Proto[]) {
    this.protos = protos;
    this.onChange.fire();
  }

  getTreeItem(element: ProtoItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: ProtoItem): Promise<ProtoItem[]> {
    let items: ProtoItem[] = [];
    if (element === undefined) {
      for (const proto of this.protos) {
        items.push(
          new ProtoItem({
            base: proto,
            protoPath: proto.path,
            protoName: proto.name,
            serviceName: null,
          })
        );
      }
      return items;
    }
    if (element.base.datatype === ProtoType.proto) {
      for (const svc of (element.base as Proto).services) {
        items.push(
          new ProtoItem({
            base: svc,
            protoPath: element.protoPath,
            protoName: element.protoName,
            serviceName: svc.name,
          })
        );
      }
    }
    if (element.base.datatype === ProtoType.service) {
      for (const call of (element.base as Service).calls) {
        items.push(
          new ProtoItem({
            base: call,
            protoPath: element.protoPath,
            protoName: element.protoName,
            serviceName: element.serviceName,
          })
        );
      }
    }
    return items;
  }

  getParent?(element: ProtoItem): vscode.ProviderResult<ProtoItem> {
    throw new Error("Method not implemented.");
  }

  resolveTreeItem?(
    item: vscode.TreeItem,
    element: ProtoItem,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TreeItem> {
    return element;
  }
}

class ProtoItem extends vscode.TreeItem {
  public base: Proto | Service | Call | Message | Field;
  public protoPath: string;
  public protoName: string;
  public serviceName: string;
  constructor(
    public input: {
      base: Proto | Service | Call | Message | Field;
      protoPath: string;
      protoName: string;
      serviceName: string;
    }
  ) {
    super(input.base.name);

    this.base = input.base;
    this.protoPath = input.protoPath;
    this.protoName = input.protoName;
    this.serviceName = input.serviceName;

    super.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    let svg = "";
    if (input.base.datatype === ProtoType.proto) {
      input.base = input.base as Proto;
      super.tooltip = `Proto schema definition`;
      svg = "proto.svg";
    }
    if (input.base.datatype === ProtoType.service) {
      input.base = input.base as Service;
      super.tooltip = input.base.description;
      svg = "svc.svg";
    }
    if (input.base.datatype === ProtoType.call) {
      super.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
      input.base = input.base as Call;
      super.tooltip = input.base.description;
      svg = "unary.svg";
      if (input.base.inputStream || input.base.outputStream) {
        svg = "stream.svg";
      }
      super.contextValue = "call";
      let request: RequestData = {
        path: input.protoPath,
        protoName: input.protoName,
        service: input.serviceName,
        call: input.base.name,
        inputMessageTag: input.base.inputMessageTag,
        inputMessageName: input.base.inputMessageTag.split(`.`).pop(),
        outputMessageName: input.base.outputMessageTag.split(`.`).pop(),
        tlsOn: true,
        host: "",
        reqJson: "",
        maxMsgSize: 0,
        code: "",
        respJson: "",
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
    if (input.base.datatype === ProtoType.message) {
      input.base = input.base as Message;
    }
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", svg),
      dark: path.join(__filename, "..", "..", "images", svg),
    };
  }
}

export interface RequestData extends RequestHistoryData {
  protoName: string;
  hosts: string[];
}
