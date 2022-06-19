import * as fs from "fs";
import * as vscode from "vscode";
import * as path from "path";
import { AdressItem } from "./item";

export class AdressListProvider implements vscode.TreeDataProvider<AdressItem> {
  onDidChangeTreeData?: vscode.Event<void | AdressItem | AdressItem[]>;
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
