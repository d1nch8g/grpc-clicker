import * as vscode from "vscode";
import { Service } from "../grpcurl/service";
import { Storage } from "../storage/storage";
import { ProtoItem } from "./item";

export class ProtosTree implements vscode.TreeDataProvider<ProtoItem> {
  constructor(private storage: Storage) {
    this.onChange = new vscode.EventEmitter<ProtoItem | undefined | void>();
    this.onDidChangeTreeData = this.onChange.event;
  }

  private onChange: vscode.EventEmitter<ProtoItem | undefined | void>;
  readonly onDidChangeTreeData: vscode.Event<void | ProtoItem | ProtoItem[]>;

  refresh(): void {
    this.onChange.fire();
  }

  getTreeItem(element: ProtoItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: ProtoItem): vscode.ProviderResult<ProtoItem[]> {
    let items: ProtoItem[] = [];
    if (element === null) {
      let protos = this.storage.protos.list();
      protos.forEach((proto) => {
        items.push(new ProtoItem(proto));
      });
      return items;
    }
    if (element.item instanceof Service) {
        
    }
  }

  getParent?(element: ProtoItem): vscode.ProviderResult<ProtoItem> {
    throw new Error("Method not implemented.");
  }

  resolveTreeItem?(
    item: vscode.TreeItem,
    element: ProtoItem,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TreeItem> {
    throw new Error("Method not implemented.");
  }
}
