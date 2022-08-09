import * as vscode from "vscode";
import { Header } from "../storage/headers";
import { ClickerItem, HeaderItem } from "./items";

export class HeadersTreeView implements vscode.TreeDataProvider<ClickerItem> {
  constructor(private headers: Header[]) {
    this.headers = headers;
    this.onChange = new vscode.EventEmitter<ClickerItem | undefined | void>();
    this.onDidChangeTreeData = this.onChange.event;
  }

  private onChange: vscode.EventEmitter<ClickerItem | undefined | void>;
  readonly onDidChangeTreeData: vscode.Event<void | ClickerItem | ClickerItem[]>;

  refresh(headers: Header[]): void {
    this.headers = headers;
    this.onChange.fire();
  }

  getTreeItem(element: ClickerItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: ClickerItem): vscode.ProviderResult<ClickerItem[]> {
    let hostItems: ClickerItem[] = [];
    for (var header of this.headers) {
      hostItems.push(new HeaderItem(header));
    }
    return hostItems;
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

