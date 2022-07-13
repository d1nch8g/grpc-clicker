import * as vscode from "vscode";
import { Host } from "../classes/host";
import { HostItem } from "./item";

export class AdressList implements vscode.TreeDataProvider<HostItem> {
  private hosts: Host[];
  constructor(hosts: Host[]) {
    this.hosts = hosts;
    this.onChange = new vscode.EventEmitter<HostItem | undefined | void>();
    this.onDidChangeTreeData = this.onChange.event;
  }

  private onChange: vscode.EventEmitter<HostItem | undefined | void>;
  readonly onDidChangeTreeData: vscode.Event<void | HostItem | HostItem[]>;

  refresh(hosts: Host[]): void {
    this.hosts = hosts;
    this.onChange.fire();
  }

  getTreeItem(element: HostItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: HostItem): vscode.ProviderResult<HostItem[]> {
    let hostItems: HostItem[] = [];
    for (var host of this.hosts) {
      hostItems.push(new HostItem(host.name, host.current));
    }
    return hostItems;
  }

  getParent?(element: HostItem): vscode.ProviderResult<HostItem> {
    throw new Error("Method not implemented.");
  }

  resolveTreeItem?(
    item: vscode.TreeItem,
    element: HostItem,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TreeItem> {
    return element;
  }
}
