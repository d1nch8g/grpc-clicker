import * as vscode from "vscode";
import * as path from "path";
import { Proto, Service, Call, ProtoType } from "../grpcurl/parser";

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
        items.push(new ProtoItem(proto, proto.path, null));
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
  constructor(
    public item: Proto | Service | Call,
    public protoPath: string,
    public serviceTag: string
  ) {
    super(item.name);
    super.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    let svg = "";
    if (item.type === ProtoType.proto) {
      item = item as Proto;
      super.tooltip = `Proto schema definition`;
      svg = "proto.svg";
    }
    if (item.type === ProtoType.service) {
      item = item as Service;
      super.tooltip = item.description;
      svg = "svc.svg";
    }
    if (item.type === ProtoType.call) {
      super.collapsibleState = vscode.TreeItemCollapsibleState.None;
      item = item as Call;
      super.tooltip = item.description;
      svg = "unary.svg";
      if (item.inputStream || item.outputStream) {
        svg = "stream.svg";
      }
      super.contextValue = "call";
      super.command = {
        command: "webview.open",
        title: "Trigger opening of webview for grpc call",
        arguments: [`alloha`],
      };
    }
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", svg),
      dark: path.join(__filename, "..", "..", "images", svg),
    };
  }
}
