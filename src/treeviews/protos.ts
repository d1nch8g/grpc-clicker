import * as vscode from "vscode";
import * as path from "path";
import { Service, Call, ProtoType, Message, Field } from "../grpcurl/parser";
import { RequestHistoryData } from "../storage/history";
import { ProtoFile } from "../grpcurl/grpcurl";

export class ProtoFilesView
  implements vscode.TreeDataProvider<vscode.TreeItem>
{
  constructor(
    private files: ProtoFile[],
    private describeMsg: (path: string, tag: string) => Promise<Message>
  ) {
    this.files = files;
    this.onChange = new vscode.EventEmitter<
      vscode.TreeItem | undefined | void
    >();
    this.onDidChangeTreeData = this.onChange.event;
  }

  private onChange: vscode.EventEmitter<vscode.TreeItem | undefined | void>;
  readonly onDidChangeTreeData: vscode.Event<
    void | vscode.TreeItem | vscode.TreeItem[]
  >;

  async refresh(protos: ProtoFile[]) {
    this.files = protos;
    this.onChange.fire();
  }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: vscode.TreeItem): Promise<vscode.TreeItem[]> {
    let items: vscode.TreeItem[] = [];
    if (element === undefined) {
      for (const file of this.files) {
        items.push(new FileItem(file));
      }
      return items;
    }
    
    return items;
  }

  getParent?(element: vscode.TreeItem): vscode.ProviderResult<vscode.TreeItem> {
    throw new Error("Method not implemented.");
  }

  resolveTreeItem?(
    item: vscode.TreeItem,
    element: vscode.TreeItem,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TreeItem> {
    return element;
  }
}

class FileItem extends vscode.TreeItem {
  constructor(public readonly base: ProtoFile) {
    super(base.name);
    const icon = `file.svg`;
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", icon),
      dark: path.join(__filename, "..", "..", "images", icon),
    };
    super.tooltip = base.path;
    super.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
  }
}

class HostsItem extends vscode.TreeItem {
  constructor(
    public readonly base: HostsItem,
    public readonly parent: FileItem
  ) {
    super(base.name);
    const icon = `svc.svg`;
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", icon),
      dark: path.join(__filename, "..", "..", "images", icon),
    };
    super.tooltip = `Hosts count: ${base.hosts.length}`;
    super.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
  }
}

class HostItem extends vscode.TreeItem {
  constructor(public readonly host: string, public readonly parent: HostsItem) {
    super(host);
    const icon = `host-off.svg`;
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", icon),
      dark: path.join(__filename, "..", "..", "images", icon),
    };
    super.collapsibleState = vscode.TreeItemCollapsibleState.None;
  }
}

class ServiceItem extends vscode.TreeItem {
  constructor(public readonly base: Service, public readonly parent: FileItem) {
    super(base.name);
    const icon = `svc.svg`;
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", icon),
      dark: path.join(__filename, "..", "..", "images", icon),
    };
    super.tooltip = base.description;
    super.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
  }
}

class CallItem extends vscode.TreeItem {
  constructor(public readonly base: Call, public readonly parent: ServiceItem) {
    super(base.name);
    let icon = "unary.svg";
    if (base.inputStream || base.outputStream) {
      icon = "stream.svg";
    }
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", icon),
      dark: path.join(__filename, "..", "..", "images", icon),
    };
    super.tooltip = base.description;
    super.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    super.contextValue = "call";
    let request: RequestData = {
      path: parent.parent.base.path,
      protoName: parent.parent.base.name,
      service: parent.base.name,
      call: base.name,
      inputMessageTag: base.inputMessageTag,
      inputMessageName: base.inputMessageTag.split(`.`).pop()!,
      outputMessageName: base.outputMessageTag.split(`.`).pop()!,
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
}

class MessageItem extends vscode.TreeItem {
  constructor(public readonly base: Message) {
    super(base.name);
    const icon = `msg.svg`;
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", icon),
      dark: path.join(__filename, "..", "..", "images", icon),
    };
    super.tooltip = base.description;
    super.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
  }
}

class FieldItem extends vscode.TreeItem {
  constructor(public readonly base: Message) {
    super(base.name);
    const icon = `field.svg`;
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", icon),
      dark: path.join(__filename, "..", "..", "images", icon),
    };
    super.tooltip = base.description;
    super.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    if (base.fields.length === 0) {
      super.collapsibleState = vscode.TreeItemCollapsibleState.None;
    }
  }
}

export interface RequestData extends RequestHistoryData {
  protoName: string;
  hosts: string[];
}

interface HostsItem {
  type: ProtoType;
  name: string;
  hosts: string[];
}

interface HostItem {
  type: ProtoType;
  name: string;
}
