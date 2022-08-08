import * as vscode from "vscode";
import { ProtoFile } from "../grpcurl/grpcurl";
import {
  ClickerItem,
  FileItem,
  HostItem,
  HostsItem,
  ItemType,
  ServiceItem,
} from "./items";
import { Message, ProtoType } from "../grpcurl/parser";

export class ProtoFilesView implements vscode.TreeDataProvider<ClickerItem> {
  constructor(
    private files: ProtoFile[],
    private describeMsg: (path: string, tag: string) => Promise<Message>
  ) {
    this.files = files;
    this.onChange = new vscode.EventEmitter<ClickerItem | undefined | void>();
    this.onDidChangeTreeData = this.onChange.event;
  }

  private onChange: vscode.EventEmitter<ClickerItem | undefined | void>;
  readonly onDidChangeTreeData: vscode.Event<
    void | ClickerItem | ClickerItem[]
  >;

  async refresh(protos: ProtoFile[]) {
    this.files = protos;
    this.onChange.fire();
  }

  getTreeItem(element: ClickerItem): ClickerItem {
    return element;
  }

  async getChildren(element?: ClickerItem): Promise<ClickerItem[]> {
    let items: ClickerItem[] = [];
    if (element === undefined) {
      for (const file of this.files) {
        items.push(new FileItem(file));
      }
      return items;
    }
    if (element.type === ItemType.file) {
      const elem = element as FileItem;
      items.push(new HostsItem(elem.base.hosts, elem));
      for (const svc of elem.base.services) {
        items.push(new ServiceItem(svc, elem));
      }
      return items;
    }
    if (element.type === ItemType.hosts) {
      const elem = element as HostsItem;
      for (const host of elem.hosts) {
        items.push(new HostItem(host, elem));
      }
    }
    return items;
  }

  getParent?(element: ClickerItem): vscode.ProviderResult<ClickerItem> {
    throw new Error("Method not implemented.");
  }

  resolveTreeItem?(
    item: ClickerItem,
    element: ClickerItem,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<ClickerItem> {
    return element;
  }
}
