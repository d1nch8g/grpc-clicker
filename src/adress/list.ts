import * as vscode from "vscode";
import { AdressItem } from "./item";
import { Adresses } from "../storage/adresses";

export class AdressList implements vscode.TreeDataProvider<AdressItem> {
  constructor(private storage: Adresses) {
    this.onChange = new vscode.EventEmitter<AdressItem | undefined | void>();
    this.onDidChangeTreeData = this.onChange.event;
  }

  private onChange: vscode.EventEmitter<AdressItem | undefined | void>;
  readonly onDidChangeTreeData: vscode.Event<void | AdressItem | AdressItem[]>;

  refresh(): void {
    this.onChange.fire();
  }

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
    console.log(element.label);
    this.storage.setCurret(element.label);
    return new AdressItem(element.label);
  }
}
