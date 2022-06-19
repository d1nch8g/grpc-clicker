import * as vscode from "vscode";
import { AdressItem } from "./item";
import { Adresses } from "../storage/adresses";

export class AdressList implements vscode.TreeDataProvider<AdressItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    AdressItem | undefined | void
  > = new vscode.EventEmitter<AdressItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<void | AdressItem | AdressItem[]> =
    this._onDidChangeTreeData.event;

  // Trigger to update element
  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  constructor(private storage: Adresses) {}

  getTreeItem(element: AdressItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: AdressItem): vscode.ProviderResult<AdressItem[]> {
    let adressesItems: AdressItem[] = [];
    let adresses = this.storage.list();
    adresses.forEach((adress) => {
      adressesItems.push(new AdressItem(adress));
    });
    return adressesItems;
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
