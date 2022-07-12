import * as vscode from "vscode";
import { MetaItem } from "./item";

export class AdressList implements vscode.TreeDataProvider<MetaItem> {
  private metas: string[];
  constructor(metas: string[]) {
    this.metas = metas;
    this.onChange = new vscode.EventEmitter<MetaItem | undefined | void>();
    this.onDidChangeTreeData = this.onChange.event;
  }

  private onChange: vscode.EventEmitter<MetaItem | undefined | void>;
  readonly onDidChangeTreeData: vscode.Event<void | MetaItem | MetaItem[]>;

  refresh(hosts: string[]): void {
    this.metas = hosts;
    this.onChange.fire();
  }

  getTreeItem(element: MetaItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: MetaItem): vscode.ProviderResult<MetaItem[]> {
    let hostItems: MetaItem[] = [];
    for (var meta of this.metas) {
      if (meta.endsWith("//IS//ON")) {
        meta = meta.replace("//IS//ON", "");
        hostItems.push(new MetaItem(meta, true));
      } else {
        hostItems.push(new MetaItem(meta, false));
      }
    }
    return hostItems;
  }

  getParent?(element: MetaItem): vscode.ProviderResult<MetaItem> {
    throw new Error("Method not implemented.");
  }

  resolveTreeItem?(
    item: vscode.TreeItem,
    element: MetaItem,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TreeItem> {
    return element;
  }
}
