import * as vscode from "vscode";
import { RequestHistoryData } from "../storage/history";
import { ClickerItem, HistoryItem } from "./items";

export class HistoryTreeView implements vscode.TreeDataProvider<ClickerItem> {
  constructor(private requests: RequestHistoryData[]) {
    this.requests = requests;
    this.onChange = new vscode.EventEmitter<ClickerItem | undefined | void>();
    this.onDidChangeTreeData = this.onChange.event;
  }

  private onChange: vscode.EventEmitter<ClickerItem | undefined | void>;
  readonly onDidChangeTreeData: vscode.Event<
    void | ClickerItem | ClickerItem[]
  >;

  refresh(requests: RequestHistoryData[]): void {
    this.requests = requests;
    this.onChange.fire();
  }

  getTreeItem(element: ClickerItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: ClickerItem): vscode.ProviderResult<ClickerItem[]> {
    let hitoryItems: ClickerItem[] = [];
    for (const request of this.requests) {
      hitoryItems.push(new HistoryItem(request));
    }
    return hitoryItems;
  }

  getParent?(element: ClickerItem): vscode.ProviderResult<ClickerItem> {
    throw new Error("Method not implemented.");
  }

  resolveTreeItem?(
    item: vscode.TreeItem,
    element: ClickerItem,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TreeItem> {
    return element;
  }
}
