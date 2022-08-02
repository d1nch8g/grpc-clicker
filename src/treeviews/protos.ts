import * as vscode from "vscode";
import * as path from "path";
import { Proto, Service, Call, ProtoType } from "../grpcurl/parser";
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
            serviceTag: null,
          })
        );
      }
      return items;
    }
    let elem = element.item;
    if (elem.type === ProtoType.proto) {
      for (const svc of (elem as Proto).services) {
        items.push(new ProtoItem(svc, element.protoPath, svc.tag));
      }
    }
    if (elem.type === ProtoType.service) {
      for (const call of (elem as Service).calls) {
        items.push(new ProtoItem(call, element.protoPath, element.serviceTag));
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
  constructor(inp: {
    base: Proto | Service | Call;
    protoPath: string;
    protoName: string;
    serviceTag: string;
  }) {
    super(inp.base.name);
    super.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    let svg = "";
    if (inp.base.type === ProtoType.proto) {
      inp.base = inp.base as Proto;
      super.tooltip = `Proto schema definition`;
      svg = "proto.svg";
    }
    if (inp.base.type === ProtoType.service) {
      inp.base = inp.base as Service;
      super.tooltip = inp.base.description;
      svg = "svc.svg";
    }
    if (inp.base.type === ProtoType.call) {
      super.collapsibleState = vscode.TreeItemCollapsibleState.None;
      inp.base = inp.base as Call;
      super.tooltip = inp.base.description;
      svg = "unary.svg";
      if (inp.base.inputStream || inp.base.outputStream) {
        svg = "stream.svg";
      }
      super.contextValue = "call";

      let request: RequestData = {
        protoName: inp.protoName,
        path: inp.protoPath,
        service: inp.serviceTag,
        call: inp.base.name,
        inputMessageTag: inp.base.inputMessageTag,
        inputMessageName: inp.base.inputMessageTag.split(`.`).pop(),
        outputMessageName: inp.base.outputMessageTag.split(`.`).pop(),
        tlsOn: null,
        host: "",
        reqJson: "",
        metadata: [],
        maxMsgSize: 0,
        code: "",
        respJson: "",
        time: "",
        date: "",
        errmes: "",
        hosts: [],
      };

      super.command = {
        command: "webview.open",
        title: "Trigger opening of webview for grpc call",
        arguments: [request],
      };
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
