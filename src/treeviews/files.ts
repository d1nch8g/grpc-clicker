import * as vscode from "vscode";
import { FileSource, ServerSource } from "../grpcurl/caller";
import { Message } from "../grpcurl/parser";
import { ProtoFile } from "../storage/protoFiles";
import {
  CallItem,
  ClickerItem,
  FieldItem,
  ItemType,
  MessageItem,
  ProtoItem,
  ServiceItem,
} from "./items";

export class ProtoFilesView implements vscode.TreeDataProvider<ClickerItem> {
  constructor(
    private files: ProtoFile[],
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

  async refresh(protoFiles: ProtoFile[]) {
    this.files = protoFiles;
    this.onChange.fire();
  }

  getTreeItem(element: ClickerItem): ClickerItem {
    return element;
  }

  async getChildren(element?: ClickerItem): Promise<ClickerItem[]> {
    let items: ClickerItem[] = [];
    if (element === undefined) {
      for (const file of this.files) {
        items.push(new ProtoItem(file));
      }
      return items;
    }
    if (element.type === ItemType.file) {
      const elem = element as ProtoItem;
      for (const svc of elem.proto.services) {
        items.push(new ServiceItem(svc, elem));
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
      const file = elem.parent.parent as ProtoItem;
      const input = await this.describeMsg(
        file.proto.source,
        elem.base.inputMessageTag
      );
      const output = await this.describeMsg(
        file.proto.source,
        elem.base.inputMessageTag
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
      const file = elem.parent.parent.parent.parent as ProtoItem;
      if (elem.base.datatype === `oneof`) {
        for (const field of elem.base.fields!) {
          items.push(new FieldItem(field, elem.parent));
        }
      }
      if (elem.base.innerMessageTag !== undefined) {
        const inner = await this.describeMsg(
          file.proto.source,
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
    item: ClickerItem,
    element: ClickerItem,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<ClickerItem> {
    return element;
  }
}
