import * as vscode from "vscode";
import { FileSource, ServerSource } from "../grpcurl/caller";
import { Message } from "../grpcurl/parser";
import { ProtoServer } from "../storage/protoServer";
import {
  CallItem,
  ClickerItem,
  FieldItem,
  ItemType,
  MessageItem,
  ProtoItem,
  ServiceItem,
} from "./items";

export class ServerTreeView implements vscode.TreeDataProvider<ClickerItem> {
  constructor(
    private servers: ProtoServer[],
    private describeMsg: (
      source: ServerSource | FileSource,
      tag: string
    ) => Promise<Message>
  ) {
    this.onChange = new vscode.EventEmitter<ClickerItem | undefined | void>();
    this.onDidChangeTreeData = this.onChange.event;
  }

  private onChange: vscode.EventEmitter<ClickerItem | undefined | void>;
  readonly onDidChangeTreeData: vscode.Event<
    void | ClickerItem | ClickerItem[]
  >;

  refresh(servers: ProtoServer[]): void {
    this.servers = servers;
    this.onChange.fire();
  }

  getTreeItem(element: ClickerItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: ClickerItem): Promise<ClickerItem[]> {
    let items: ClickerItem[] = [];
    if (element === undefined) {
      for (const server of this.servers) {
        items.push(new ProtoItem(server));
      }
      return items;
    }
    if (element.type === ItemType.server) {
      const elem = element as ProtoItem;
      for (const service of elem.proto.services) {
        items.push(new ServiceItem(service, elem));
      }
      return items;
    }
    if (element.type === ItemType.service) {
      const elem = element as ServiceItem;
      for (const call of elem.base.calls) {
        items.push(new CallItem(call, elem));
      }
    }
    if (element.type === ItemType.call) {
      const elem = element as CallItem;
      const server = elem.parent.parent as ProtoItem;
      const input = await this.describeMsg(
        server.proto.source,
        elem.base.inputMessageTag
      );
      const output = await this.describeMsg(
        server.proto.source,
        elem.base.outputMessageTag
      );
      items.push(new MessageItem(input, elem));
      items.push(new MessageItem(output, elem));
    }
    if (element.type === ItemType.message) {
      const elem = element as MessageItem;
      for (const field of elem.base.fields) {
        items.push(new FieldItem(field, elem));
      }
    }
    if (element.type === ItemType.field) {
      const elem = element as FieldItem;
      const server = elem.parent.parent.parent.parent as ProtoItem;
      if (elem.base.datatype === `oneof`) {
        for (const field of elem.base.fields!) {
          items.push(new FieldItem(field, elem.parent));
        }
      }
      if (elem.base.innerMessageTag !== undefined) {
        const inner = await this.describeMsg(
          server.proto.source,
          elem.base.innerMessageTag
        );
        for (const field of inner.fields) {
          items.push(new FieldItem(field, elem.parent));
        }
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
