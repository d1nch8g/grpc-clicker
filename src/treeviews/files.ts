import * as vscode from "vscode";
import { FileSource } from "../grpcurl/caller";
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

/**
 * Entity representing proto schema and server source
 */
export interface ProtosTreeViewParams {
  /**
   * Proto files that will be displayed in tree view.
   */
  files: ProtoFile[];
  /**
   * Method that will be called whem message description is required
   */
  describeMsg: (
    /**
     * Path to proto file
     */
    path: string,
    /**
     * Import path for additional source files
     */
    importPath: string,
    /**
     * Message tag in `grpcurl` compatible format
     */
    tag: string
  ) => Promise<Message>;
}

export class ProtoFilesView implements vscode.TreeDataProvider<ClickerItem> {
  constructor(private params: ProtosTreeViewParams) {
    this.onChange = new vscode.EventEmitter<ClickerItem | undefined | void>();
    this.onDidChangeTreeData = this.onChange.event;
  }

  private onChange: vscode.EventEmitter<ClickerItem | undefined | void>;
  readonly onDidChangeTreeData: vscode.Event<
    void | ClickerItem | ClickerItem[]
  >;

  async refresh(protoFiles: ProtoFile[]) {
    this.params.files = protoFiles;
    this.onChange.fire();
  }

  getTreeItem(element: ClickerItem): ClickerItem {
    return element;
  }

  async getChildren(element?: ClickerItem): Promise<ClickerItem[]> {
    let items: ClickerItem[] = [];
    if (element === undefined) {
      for (const file of this.params.files) {
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
      const source = file.proto.source as FileSource;
      const input = await this.params.describeMsg(
        source.filePath,
        source.importPath,
        elem.base.inputMessageTag
      );
      const output = await this.params.describeMsg(
        source.filePath,
        source.importPath,
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
      const file = elem.parent.parent.parent.parent as ProtoItem;
      const source = file.proto.source as FileSource;
      if (elem.base.datatype === `oneof`) {
        for (const field of elem.base.fields!) {
          items.push(new FieldItem(field, elem.parent));
        }
      }
      if (elem.base.innerMessageTag !== undefined) {
        const inner = await this.params.describeMsg(
          source.filePath,
          source.importPath,
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
