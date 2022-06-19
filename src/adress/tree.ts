import * as vscode from "vscode";
import * as path from "path";
import { AdressItem } from "./item";
import { Storage } from "../storage/storage";

export class AdressList implements vscode.TreeDataProvider<AdressItem> {
  constructor(private storage: Storage) {}

  getTreeItem(element: AdressItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: AdressItem): vscode.ProviderResult<AdressItem[]> {
    let adressesItems: AdressItem[] = [];
    let adresses = this.storage.adresses.list();
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
