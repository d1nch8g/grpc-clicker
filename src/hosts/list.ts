import * as vscode from "vscode";
import { HostItem } from "./item";
import { Adresses } from "../storage/adresses";

export class AdressList implements vscode.TreeDataProvider<HostItem> {
  constructor(private storage: Adresses) {
    this.onChange = new vscode.EventEmitter<HostItem | undefined | void>();
    this.onDidChangeTreeData = this.onChange.event;
  }

  private onChange: vscode.EventEmitter<HostItem | undefined | void>;
  readonly onDidChangeTreeData: vscode.Event<void | HostItem | HostItem[]>;

  refresh(): void {
    this.onChange.fire();
  }

  getTreeItem(element: HostItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: HostItem): vscode.ProviderResult<HostItem[]> {
    let adressesItems: HostItem[] = [];
    let adresses = this.storage.list();
    adresses.forEach((adress) => {
      adressesItems.push(new HostItem(adress));
    });
    return adressesItems;
  }

  getParent?(element: HostItem): vscode.ProviderResult<HostItem> {
    throw new Error("Method not implemented.");
  }

  resolveTreeItem?(
    item: vscode.TreeItem,
    element: HostItem,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TreeItem> {
    this.storage.setCurret(element.label);
    return new HostItem(element.label);
  }
}
