import * as vscode from "vscode";
import { ProtoSource } from "../grpcurl/caller";
import { Proto } from "../grpcurl/grpcurl";
import { Message } from "../grpcurl/parser";
import {
  CallItem,
  ClickerItem,
  FieldItem,
  GroupItem,
  ItemType,
  MessageItem,
  ProtoItem,
  ServiceItem,
} from "./items";

export class ProtosTreeView implements vscode.TreeDataProvider<ClickerItem> {
  constructor(
    private protos: Proto[],
    private describeMsg: (
      source: ProtoSource,
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

  refresh(servers: Proto[]): void {
    this.protos = servers;
    this.onChange.fire();
  }

  getTreeItem(element: ClickerItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: ClickerItem): Promise<ClickerItem[]> {
    let items: ClickerItem[] = [];
    if (element === undefined) {
      for (const proto of this.protos) {
        if (proto.source.group !== undefined) {
          let duplicate = false;
          for (const item of items) {
            const group = item as GroupItem;
            if (proto.source.group === group.name) {
              duplicate = true;
            }
          }
          if (duplicate) {
            continue;
          }
          items.push(new GroupItem(proto.source.group));
        } else {
          items.push(new ProtoItem(proto));
        }
      }
      return items;
    }
    if (element.type === ItemType.group) {
      const elem = element as GroupItem;
      for (const proto of this.protos) {
        if (proto.source.group === elem.name) {
          items.push(new ProtoItem(proto));
        }
      }
    }
    if (element.type === ItemType.proto) {
      const elem = element as ProtoItem;
      for (const service of elem.proto.schema.services) {
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
