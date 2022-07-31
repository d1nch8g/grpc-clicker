import * as vscode from "vscode";
import * as path from "path";
import { RequestHistoryData } from "../storage/history";

export class HistoryTreeView implements vscode.TreeDataProvider<HistoryItem> {
  constructor(private requests: RequestHistoryData[]) {
    this.requests = requests;
    this.onChange = new vscode.EventEmitter<HistoryItem | undefined | void>();
    this.onDidChangeTreeData = this.onChange.event;
  }

  private onChange: vscode.EventEmitter<HistoryItem | undefined | void>;
  readonly onDidChangeTreeData: vscode.Event<
    void | HistoryItem | HistoryItem[]
  >;

  update(requests: RequestHistoryData[]): void {
    this.requests = requests;
    this.onChange.fire();
  }

  getTreeItem(element: HistoryItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: HistoryItem): vscode.ProviderResult<HistoryItem[]> {
    let hitoryItems: HistoryItem[] = [];
    for (const request of this.requests) {
      hitoryItems.push(new HistoryItem(request));
    }
    return hitoryItems;
  }

  getParent?(element: HistoryItem): vscode.ProviderResult<HistoryItem> {
    throw new Error("Method not implemented.");
  }

  resolveTreeItem?(
    item: vscode.TreeItem,
    element: HistoryItem,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TreeItem> {
    return element;
  }
}

class HistoryItem extends vscode.TreeItem {
  constructor(request: RequestHistoryData) {
    super(`${request.protoName} - ${request.method}`);

    super.description = request.date;
    super.contextValue = "host";

    super.tooltip = `File: ${request.path}\n
Proto: ${request.proto}\n
Service: ${request.service}\n
Rpc: ${request.call}\n
Tag: ${request.methodTag}\n
Host: ${request.host}\n
Input format: ${request.reqName}\n
Output format: ${request.respName}\n`;

    super.contextValue = "call";
    super.command = {
      command: "webview.open",
      title: "Trigger opening of webview for grpc call",
      arguments: [request],
    };

    let icon = `success.svg`;
    if (request.error !== ``) {
      icon = `error.svg`;
    }

    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", icon),
      dark: path.join(__filename, "..", "..", "images", icon),
    };
  }
}