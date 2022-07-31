import * as vscode from "vscode";
import * as path from "path";
import { Host } from "../storage/hosts";

export class HostsTreeView implements vscode.TreeDataProvider<HostItem> {
  constructor(private hosts: Host[]) {
    this.onChange = new vscode.EventEmitter<HostItem | undefined | void>();
    this.onDidChangeTreeData = this.onChange.event;
  }

  private onChange: vscode.EventEmitter<HostItem | undefined | void>;
  readonly onDidChangeTreeData: vscode.Event<void | HostItem | HostItem[]>;

  update(hosts: Host[]): void {
    this.hosts = hosts;
    this.onChange.fire();
  }

  getTreeItem(element: HostItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: HostItem): vscode.ProviderResult<HostItem[]> {
    let hostItems: HostItem[] = [];
    for (var host of this.hosts) {
      hostItems.push(new HostItem(host));
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

class HostItem extends vscode.TreeItem {
  constructor(host: Host) {
    super(host.adress);
    super.tooltip = host.description;
    super.contextValue = "host";
    super.command = {
      command: "hosts.switch",
      title: "Switch grpc host",
      arguments: [host],
    };
    let img = "host-off.svg";
    if (host.current) {
      img = "host-on.svg";
    }
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", img),
      dark: path.join(__filename, "..", "..", "images", img),
    };
  }
}
