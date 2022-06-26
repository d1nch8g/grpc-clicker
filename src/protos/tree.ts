import * as vscode from "vscode";
import { Call } from "../grpcurl/call";
import { Message } from "../grpcurl/message";
import { Proto } from "../grpcurl/proto";
import { Service } from "../grpcurl/service";
import { Storage } from "../storage/storage";
import { ProtoItem } from "./item";

export class ProtosTree implements vscode.TreeDataProvider<ProtoItem> {
  constructor(private storage: Storage) {
    this.onChange = new vscode.EventEmitter<ProtoItem | undefined | void>();
    this.onDidChangeTreeData = this.onChange.event;
  }

  private onChange: vscode.EventEmitter<ProtoItem | undefined | void>;
  readonly onDidChangeTreeData: vscode.Event<void | ProtoItem | ProtoItem[]>;

  refresh(): void {
    this.onChange.fire();
  }

  getTreeItem(element: ProtoItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: ProtoItem): Promise<ProtoItem[]> {
    let items: ProtoItem[] = [];
    if (element === null) {
      let protos = this.storage.protos.list();
      protos.forEach((proto) => {
        items.push(new ProtoItem(proto));
      });
      return items;
    }
    let elem = element.item;
    if (elem instanceof Proto) {
      elem.services.forEach((svc) => {
        items.push(new ProtoItem(svc));
      });
      elem.messages.forEach((msg) => {
        items.push(new ProtoItem(msg));
      });
    }
    if (elem instanceof Service) {
      elem.calls.forEach((call) => {
        items.push(new ProtoItem(call));
      });
    }
    if (elem instanceof Call) {
      items.push(new ProtoItem(elem.input));
      items.push(new ProtoItem(elem.output));
    }
    if (elem instanceof Message) {
      let fields = await elem.getFields();
      fields.forEach((field) => {
        items.push(new ProtoItem(field));
      });
    }
  }

  getParent?(element: ProtoItem): vscode.ProviderResult<ProtoItem> {
    throw new Error("Method not implemented.");
  }

  resolveTreeItem?(
    item: vscode.TreeItem,
    element: ProtoItem,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TreeItem> {
    throw new Error("Method not implemented.");
  }
}
