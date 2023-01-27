import * as vscode from "vscode";
import { HistoryValue } from "../storage/history";
import { ClickerItem, HistoryItem } from "./items";

export class HistoryTreeView implements vscode.TreeDataProvider<ClickerItem> {
  constructor(private historyValues: HistoryValue[]) {
    this.historyValues = historyValues;
    this.onChange = new vscode.EventEmitter<ClickerItem | undefined | void>();
    this.onDidChangeTreeData = this.onChange.event;
  }

  private onChange: vscode.EventEmitter<ClickerItem | undefined | void>;
  readonly onDidChangeTreeData: vscode.Event<
    void | ClickerItem | ClickerItem[]
  >;

  refresh(requests: HistoryValue[]): void {
    this.historyValues = requests;
    this.onChange.fire();
  }

  getTreeItem(element: ClickerItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: ClickerItem): vscode.ProviderResult<ClickerItem[]> {
    let hitoryItems: ClickerItem[] = [];
    for (const value of this.historyValues) {
      hitoryItems.push(new HistoryItem(value));
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
