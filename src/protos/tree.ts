import * as vscode from "vscode";
import { Call } from "../classes/call";
import { Message } from "../classes/message";
import { Proto } from "../classes/proto";
import { Service } from "../classes/service";
import { Grpcurl } from "../grpcurl/grpcurl";
import { ProtoItem } from "./item";

export class ProtosTree implements vscode.TreeDataProvider<ProtoItem> {
  private protos: Proto[];
  constructor(private grpcurl: Grpcurl, protos: Proto[]) {
    this.protos = protos;
    this.onChange = new vscode.EventEmitter<ProtoItem | undefined | void>();
    this.onDidChangeTreeData = this.onChange.event;
  }

  private onChange: vscode.EventEmitter<ProtoItem | undefined | void>;
  readonly onDidChangeTreeData: vscode.Event<void | ProtoItem | ProtoItem[]>;

  refresh(protos: Proto[]): void {
    this.protos = protos;
    this.onChange.fire();
  }

  getTreeItem(element: ProtoItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: ProtoItem): Promise<ProtoItem[]> {
    let items: ProtoItem[] = [];
    if (element === undefined) {
      for (const proto of this.protos) {
        items.push(new ProtoItem(proto));
      }
      return items;
    }
    let elem = element.item;
    if (elem instanceof Proto) {
      for (const svc of elem.services) {
        items.push(new ProtoItem(svc));
      }
      for (const msg of elem.messages) {
        items.push(new ProtoItem(msg));
      }
    }
    if (elem instanceof Service) {
      for (const call of elem.calls) {
        items.push(new ProtoItem(call));
      }
    }
    if (elem instanceof Call) {
      elem.input.fields = await this.grpcurl.getFields(elem.input);
      elem.output.fields = await this.grpcurl.getFields(elem.output);
      items.push(new ProtoItem(elem.input));
      items.push(new ProtoItem(elem.output));
    }
    if (elem instanceof Message) {
      let fields = await this.grpcurl.getFields(elem);
      for (const field of fields) {
        items.push(new ProtoItem(field));
      }
    }
    return items;
  }

  getParent?(element: ProtoItem): vscode.ProviderResult<ProtoItem> {
    throw new Error("Method not implemented.");
  }

  resolveTreeItem?(
    item: vscode.TreeItem,
    element: ProtoItem,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TreeItem> {
    return element;
  }
}
