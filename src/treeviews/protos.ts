import * as vscode from "vscode";
import * as path from "path";
import { Call } from "../classes/call";
import { Message } from "../classes/message";
import { Proto } from "../classes/proto";
import { Service } from "../classes/service";
import { Grpcurl } from "../grpcurl";
import { Field } from "../classes/field";
import { Request } from "../classes/request";

export class ProtosTreeView implements vscode.TreeDataProvider<ProtoItem> {
  constructor(private grpcurl: Grpcurl, private protos: string[]) {
    this.protos = protos;
    this.onChange = new vscode.EventEmitter<ProtoItem | undefined | void>();
    this.onDidChangeTreeData = this.onChange.event;
  }

  private onChange: vscode.EventEmitter<ProtoItem | undefined | void>;
  readonly onDidChangeTreeData: vscode.Event<void | ProtoItem | ProtoItem[]>;

  async update(protos: string[]) {
    this.protos = protos;
    this.onChange.fire();
  }

  getTreeItem(element: ProtoItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: ProtoItem): Promise<ProtoItem[]> {
    let items: ProtoItem[] = [];
    if (element === undefined) {
      const protos = await this.grpcurl.protos(this.protos);
      for (const proto of protos) {
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

class ProtoItem extends vscode.TreeItem {
  constructor(public item: Proto | Service | Call | Message | Field) {
    super(item.name);
    super.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    let svg = "";
    if (item instanceof Proto) {
      super.tooltip = "Parsed proto schema definition";
      svg = "proto.svg";
    }
    if (item instanceof Service) {
      super.tooltip = "gRPC service";
      svg = "svc.svg";
    }
    if (item instanceof Call) {
      super.collapsibleState = vscode.TreeItemCollapsibleState.None;
      if (item.inputIsStream || item.outputIsStream) {
        super.tooltip = "gRPC stream (NOT SUPPORTED YET)";
        svg = "stream.svg";
      } else {
        super.tooltip = "gRPC unary call";
        svg = "unary.svg";
      }
      let isStream = item.inputIsStream || item.outputIsStream;
      super.contextValue = "call";
      super.command = {
        command: "webview.open",
        title: "Trigger opening of webview for grpc call",
        arguments: [
          new Request(
            item.proto.path,
            item.proto.shortName,
            item.proto.version,
            item.service,
            item.name,
            item.tag,
            `to fill`,
            [],
            item.input.name,
            item.output.name,
            item.input.representation(),
            isStream,
            "",
            "",
            ""
          ),
        ],
      };
    }
    if (item instanceof Message) {
      super.tooltip = "User defined gRPC message from schema";
      super.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
      svg = "msg.svg";
    }
    if (item instanceof Field) {
      super.tooltip = "Field in gRPC message";
      super.collapsibleState = vscode.TreeItemCollapsibleState.None;
      svg = "field.svg";
    }
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", svg),
      dark: path.join(__filename, "..", "..", "images", svg),
    };
  }
}
