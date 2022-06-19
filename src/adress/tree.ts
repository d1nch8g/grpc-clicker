import * as vscode from "vscode";
import * as path from "path";
import { AdressItem } from "./item";

export class AdressList implements vscode.TreeDataProvider<AdressItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    AdressItem | undefined | void
  > = new vscode.EventEmitter<AdressItem | undefined | void>();

  readonly onDidChangeTreeData: vscode.Event<void | AdressItem | AdressItem[]> =
    this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(
    element: AdressItem
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    throw new Error("Method not implemented.");
  }

  getChildren(element?: AdressItem): vscode.ProviderResult<AdressItem[]> {
    throw new Error("Method not implemented.");
  }

  getParent?(element: AdressItem): vscode.ProviderResult<AdressItem> {
    throw new Error("Method not implemented.");
  }

  resolveTreeItem?(
    item: vscode.TreeItem,
    element: AdressItem,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TreeItem> {
    throw new Error("Method not implemented.");
  }
}
