import * as vscode from "vscode";
import { Collection } from "../storage/collections";
import { ClickerItem, CollectionItem, ItemType, TestItem } from "./items";

export class CollectionsTreeView
  implements vscode.TreeDataProvider<ClickerItem>
{
  constructor(private collections: Collection[]) {
    this.collections = collections;
    this.onChange = new vscode.EventEmitter<ClickerItem | undefined | void>();
    this.onDidChangeTreeData = this.onChange.event;
  }

  private onChange: vscode.EventEmitter<ClickerItem | undefined | void>;
  readonly onDidChangeTreeData: vscode.Event<
    void | ClickerItem | ClickerItem[]
  >;

  refresh(collections: Collection[]): void {
    this.collections = collections;
    this.onChange.fire();
  }

  getTreeItem(element: ClickerItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: ClickerItem): vscode.ProviderResult<ClickerItem[]> {
    let items: ClickerItem[] = [];
    if (element === undefined) {
      for (const collection of this.collections) {
        items.push(new CollectionItem(collection));
      }
      return items;
    }
    if (element.type === ItemType.collection) {
      const collection = element as CollectionItem;
      for (const data of collection.base.tests) {
        items.push(new TestItem(data, collection));
      }
    }
    return items;
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
