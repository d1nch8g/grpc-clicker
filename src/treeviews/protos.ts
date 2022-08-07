import * as vscode from "vscode";
import * as path from "path";
import {
  Proto,
  Service,
  Call,
  ProtoType,
  Message,
  Field,
} from "../grpcurl/parser";
import { RequestHistoryData } from "../storage/history";

export class ProtosTreeView implements vscode.TreeDataProvider<ProtoItem> {
  constructor(
    private protos: Proto[],
    private describeMsg: (path: string, tag: string) => Promise<Message>
  ) {
    this.protos = protos;
    this.onChange = new vscode.EventEmitter<ProtoItem | undefined | void>();
    this.onDidChangeTreeData = this.onChange.event;
  }

  private onChange: vscode.EventEmitter<ProtoItem | undefined | void>;
  readonly onDidChangeTreeData: vscode.Event<void | ProtoItem | ProtoItem[]>;

  async refresh(protos: Proto[]) {
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
        items.push(
          new ProtoItem({
            base: proto,
            protoPath: proto.path,
            protoName: proto.name,
            serviceName: undefined,
          })
        );
      }
      return items;
    }
    if (element.base.type === ProtoType.proto) {
      for (const svc of (element.base as Proto).services) {
        items.push(
          new ProtoItem({
            base: svc,
            protoPath: element.protoPath,
            protoName: element.protoName,
            serviceName: svc.name,
          })
        );
      }
    }
    if (element.base.type === ProtoType.service) {
      for (const call of (element.base as Service).calls) {
        items.push(
          new ProtoItem({
            base: call,
            protoPath: element.protoPath,
            protoName: element.protoName,
            serviceName: element.serviceName,
          })
        );
      }
    }
    if (element.base.type === ProtoType.call) {
      element.base = element.base as Call;
      items.push(
        new ProtoItem({
          base: await this.describeMsg(
            element.protoPath,
            element.base.inputMessageTag
          ),
          protoPath: element.protoPath,
          protoName: element.protoName,
          serviceName: element.serviceName,
        })
      );
      items.push(
        new ProtoItem({
          base: await this.describeMsg(
            element.protoPath,
            element.base.outputMessageTag
          ),
          protoPath: element.protoPath,
          protoName: element.protoName,
          serviceName: element.serviceName,
        })
      );
    }
    if (element.base.type === ProtoType.message) {
      element.base = element.base as Message;
      for (const field of element.base.fields) {
        items.push(
          new ProtoItem({
            base: field,
            protoPath: element.protoPath,
            protoName: element.protoName,
            serviceName: element.serviceName,
          })
        );
      }
    }
    if (element.base.type === ProtoType.field) {
      element.base = element.base as Field;
      if (element.base.innerMessageTag !== undefined) {
        let innerMessage = await this.describeMsg(
          element.protoPath,
          element.base.innerMessageTag
        );
        for (const field of innerMessage.fields) {
          if (field.innerMessageTag === element.base.innerMessageTag) {
            field.innerMessageTag = undefined;
          }
          items.push(
            new ProtoItem({
              base: field,
              protoPath: element.protoPath,
              protoName: element.protoName,
              serviceName: element.serviceName,
            })
          );
        }
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
  public base: Proto | Service | Call | Message | Field;
  public protoPath: string;
  public protoName: string;
  public serviceName: string;
  constructor(
    public input: {
      base: Proto | Service | Call | Message | Field;
      protoPath: string;
      protoName: string;
      serviceName: string;
    }
  ) {
    super(input.base.name);

    this.base = input.base;
    this.protoPath = input.protoPath;
    this.protoName = input.protoName;
    this.serviceName = input.serviceName;

    super.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    let svg = "";
    if (input.base.type === ProtoType.proto) {
      input.base = input.base as Proto;
      super.tooltip = `Proto schema definition`;
      svg = "proto.svg";
    }
    if (input.base.type === ProtoType.service) {
      input.base = input.base as Service;
      super.tooltip = input.base.description;
      svg = "svc.svg";
    }
    if (input.base.type === ProtoType.call) {
      super.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
      input.base = input.base as Call;
      super.tooltip = input.base.description;
      svg = "unary.svg";
      if (input.base.inputStream || input.base.outputStream) {
        svg = "stream.svg";
      }
      super.contextValue = "call";
      let request: RequestData = {
        path: input.protoPath,
        protoName: input.protoName,
        service: input.serviceName,
        call: input.base.name,
        inputMessageTag: input.base.inputMessageTag,
        inputMessageName: input.base.inputMessageTag.split(`.`).pop()!,
        outputMessageName: input.base.outputMessageTag.split(`.`).pop()!,
        plaintext: true,
        host: "",
        reqJson: "",
        maxMsgSize: 0,
        code: "",
        respJson: "",
        time: "",
        date: "",
        errmes: "",
        metadata: [],
        hosts: [],
      };
      super.command = {
        command: "webview.open",
        title: "Trigger opening of webview for grpc call",
        arguments: [request],
      };
    }
    if (input.base.type === ProtoType.message) {
      input.base = input.base as Message;
      super.tooltip = input.base.description;
      super.description = input.base.tag;
      if (input.base.fields.length === 0) {
        super.collapsibleState = vscode.TreeItemCollapsibleState.None;
      }
      svg = "msg.svg";
    }
    if (input.base.type === ProtoType.field) {
      input.base = input.base as Field;
      super.tooltip = input.base.description;
      super.description = input.base.datatype;
      if (input.base.innerMessageTag === undefined) {
        super.collapsibleState = vscode.TreeItemCollapsibleState.None;
      }
      svg = "field.svg";
    }
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", svg),
      dark: path.join(__filename, "..", "..", "images", svg),
    };
  }
}

export interface RequestData extends RequestHistoryData {
  protoName: string;
  hosts: string[];
}
