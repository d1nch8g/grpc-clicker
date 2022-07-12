import * as vscode from "vscode";
import { Meta } from "../classes/meta";
import { MetaItem } from "./item";

export class MetasList implements vscode.TreeDataProvider<MetaItem> {
  private metas: Meta[];
  constructor(metas: Meta[]) {
    this.metas = metas;
    this.onChange = new vscode.EventEmitter<MetaItem | undefined | void>();
    this.onDidChangeTreeData = this.onChange.event;
  }

  private onChange: vscode.EventEmitter<MetaItem | undefined | void>;
  readonly onDidChangeTreeData: vscode.Event<void | MetaItem | MetaItem[]>;

  refresh(metas: Meta[]): void {
    this.metas = metas;
    this.onChange.fire();
  }

  getTreeItem(element: MetaItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: MetaItem): vscode.ProviderResult<MetaItem[]> {
    let hostItems: MetaItem[] = [];
    for (var meta of this.metas) {
      hostItems.push(new MetaItem(meta.name, meta.isOn));
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
