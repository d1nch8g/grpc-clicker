import * as vscode from "vscode";
import * as path from "path";
import { Service, Call, ProtoType, Message, Field } from "../grpcurl/parser";
import { RequestHistoryData } from "../storage/history";
import { ProtoFile } from "../grpcurl/grpcurl";

export class ProtoFilesView implements vscode.TreeDataProvider<ProtoItem> {
  constructor(
    private protos: ProtoFile[],
    private describeMsg: (path: string, tag: string) => Promise<Message>
  ) {
    this.protos = protos;
    this.onChange = new vscode.EventEmitter<ProtoItem | undefined | void>();
    this.onDidChangeTreeData = this.onChange.event;
  }

  private onChange: vscode.EventEmitter<ProtoItem | undefined | void>;
  readonly onDidChangeTreeData: vscode.Event<void | ProtoItem | ProtoItem[]>;

  async refresh(protos: ProtoFile[]) {
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
            serviceName: "",
            hosts: undefined,
          })
        );
      }
      return items;
    }
    if (element.base.type === ProtoType.proto) {
      const hosts: Hosts = {
        type: ProtoType.hosts,
        name: "hosts",
        hosts: (element.base as ProtoFile).hosts,
      };
      items.push(
        new ProtoItem({
          base: hosts,
          protoPath: ``,
          protoName: ``,
          serviceName: ``,
          hosts: hosts,
        })
      );
      for (const svc of (element.base as ProtoFile).services) {
        items.push(
          new ProtoItem({
            base: svc,
            protoPath: element.protoPath,
            protoName: element.protoName,
            serviceName: svc.name,
            hosts: undefined,
          })
        );
      }
    }
    if (element.base.type === ProtoType.hosts) {
      for (const host of (element.base as Hosts).hosts) {
        const hostElem: Host = {
          type: ProtoType.host,
          name: host,
        };
        items.push(
          new ProtoItem({
            base: hostElem,
            protoPath: ``,
            protoName: ``,
            serviceName: ``,
            hosts: undefined,
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
            hosts: undefined,
          })
        );
      }
    }
    if (element.base.type === ProtoType.call) {
      const call = element.base as Call;
      items.push(
        new ProtoItem({
          base: await this.describeMsg(element.protoPath, call.inputMessageTag),
          protoPath: element.protoPath,
          protoName: element.protoName,
          serviceName: element.serviceName,
          hosts: undefined,
        })
      );
      items.push(
        new ProtoItem({
          base: await this.describeMsg(
            element.protoPath,
            call.outputMessageTag
          ),
          protoPath: element.protoPath,
          protoName: element.protoName,
          serviceName: element.serviceName,
          hosts: undefined,
        })
      );
    }
    if (element.base.type === ProtoType.message) {
      const msg = element.base as Message;
      for (const field of msg.fields) {
        items.push(
          new ProtoItem({
            base: field,
            protoPath: element.protoPath,
            protoName: element.protoName,
            serviceName: element.serviceName,
            hosts: undefined,
          })
        );
      }
    }
    if (element.base.type === ProtoType.field) {
      const field = element.base as Field;
      if (field.innerMessageTag !== undefined) {
        let innerMessage = await this.describeMsg(
          element.protoPath,
          field.innerMessageTag
        );
        for (const innnerField of innerMessage.fields) {
          if (innnerField.innerMessageTag === field.innerMessageTag) {
            innnerField.innerMessageTag = undefined;
          }
          items.push(
            new ProtoItem({
              base: innnerField,
              protoPath: element.protoPath,
              protoName: element.protoName,
              serviceName: element.serviceName,
              hosts: undefined,
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
  public base: ProtoFile | Hosts | Host | Service | Call | Message | Field;
  public protoPath: string;
  public protoName: string;
  public serviceName: string;
  constructor(
    public input: {
      base: ProtoFile | Hosts | Host | Service | Call | Message | Field;
      protoPath: string;
      protoName: string;
      serviceName: string;
      hosts: Hosts | undefined;
    }
  ) {
    super(input.base.name);

    this.base = input.base;
    this.protoPath = input.protoPath;
    this.protoName = input.protoName;
    this.serviceName = input.serviceName;

    super.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    let svg = "";
    if (input.base.type === ProtoType.hosts) {
      super.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
      svg = "svc.svg";
    }
    if (input.base.type === ProtoType.host) {
      super.collapsibleState = vscode.TreeItemCollapsibleState.None;
      svg = "host-off.svg";
    }
    if (input.base.type === ProtoType.proto) {
      super.tooltip = `Proto schema definition`;
      svg = "proto.svg";
    }
    if (input.base.type === ProtoType.service) {
      const svc = input.base as Service;
      super.tooltip = svc.description;
      svg = "svc.svg";
    }
    if (input.base.type === ProtoType.call) {
      const call = input.base as Call;
      super.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
      super.tooltip = call.description;
      svg = "unary.svg";
      if (call.inputStream || call.outputStream) {
        svg = "stream.svg";
      }
      super.contextValue = "call";
      let request: RequestData = {
        path: input.protoPath,
        protoName: input.protoName,
        service: input.serviceName,
        call: call.name,
        inputMessageTag: call.inputMessageTag,
        inputMessageName: call.inputMessageTag.split(`.`).pop()!,
        outputMessageName: call.outputMessageTag.split(`.`).pop()!,
        plaintext: true,
        host: "",
        json: "",
        maxMsgSize: 0,
        code: "",
        response: "",
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
      const msg = input.base as Message;
      super.tooltip = msg.description;
      super.description = msg.tag;
      if (msg.fields.length === 0) {
        super.collapsibleState = vscode.TreeItemCollapsibleState.None;
      }
      svg = "msg.svg";
    }
    if (input.base.type === ProtoType.field) {
      const field = input.base as Field;
      super.tooltip = field.description;
      super.description = field.datatype;
      if (field.innerMessageTag === undefined) {
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

interface Hosts {
  type: ProtoType;
  name: string;
  hosts: string[];
}

interface Host {
  type: ProtoType;
  name: string;
}
