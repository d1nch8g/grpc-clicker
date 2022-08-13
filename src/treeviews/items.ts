import * as vscode from "vscode";
import * as path from "path";
import { Service, Call, Message, Field } from "../grpcurl/parser";
import { Host, ProtoFile, ProtoServer, RequestData } from "../grpcurl/grpcurl";

import { Header } from "../storage/headers";
import { Collection } from "../storage/collections";

export enum ItemType {
  unknown,
  file,
  server,
  hosts,
  host,
  service,
  call,
  message,
  field,
  header,
  collection,
  test,
}

export class ClickerItem extends vscode.TreeItem {
  public type: ItemType = ItemType.unknown;
}

export class CollectionItem extends ClickerItem {
  constructor(public readonly base: Collection) {
    super(base.name);
    super.type = ItemType.collection;
    super.tooltip = new vscode.MarkdownString(`
#### Collection with gRPC tests
- You can add new items from gRPC request
- Collection will execute tests sequentially
    `);
    super.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    super.contextValue = `collection`;
    const icon = `collection.svg`;
    if (base.tests.length === 0) {
      super.collapsibleState = vscode.TreeItemCollapsibleState.None;
    }
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", icon),
      dark: path.join(__filename, "..", "..", "images", icon),
    };
  }
}

export class TestItem extends ClickerItem {
  constructor(public readonly base: RequestData) {
    super(`${base.call}`);
    super.type = ItemType.test;
    super.tooltip = new vscode.MarkdownString(`
#### Test item
- Expected code: ${base.expectedCode}
- Expected time: ${base.expectedTime}
- Expected response

\`\`\`json
${base.json.split(`\n`).slice(0, 40).join(`\n`)}
\`\`\`
    `);
    super.collapsibleState = vscode.TreeItemCollapsibleState.None;
    const icon = `collection.svg`;
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", icon),
      dark: path.join(__filename, "..", "..", "images", icon),
    };
  }
}

export class FileItem extends ClickerItem {
  constructor(public readonly base: ProtoFile) {
    super(base.path.replace(/^.*[\\\/]/, ""));
    super.type = ItemType.file;
    super.tooltip = base.path;
    super.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    super.contextValue = `file`;
    const icon = `file.svg`;
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", icon),
      dark: path.join(__filename, "..", "..", "images", icon),
    };
  }
}

export class ServerItem extends ClickerItem {
  constructor(public readonly base: ProtoServer) {
    super(base.adress);
    super.type = ItemType.server;
    super.description = `TLS: on`;
    if (base.plaintext) {
      super.description = `TLS: off`;
    }
    super.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    super.contextValue = `server`;
    let icon = `host-on.svg`;
    if (base.services.length === 0) {
      super.collapsibleState = vscode.TreeItemCollapsibleState.None;
      icon = `host-down.svg`;
    }
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", icon),
      dark: path.join(__filename, "..", "..", "images", icon),
    };
  }
}

export class HostsItem extends ClickerItem {
  constructor(public readonly hosts: Host[], public readonly parent: FileItem) {
    super(`hosts`);
    super.type = ItemType.hosts;
    super.tooltip = `Hosts for gRPC calls for current file.`;
    super.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    super.contextValue = `hosts`;
    const icon = `hosts.svg`;
    super.contextValue = "hosts";
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", icon),
      dark: path.join(__filename, "..", "..", "images", icon),
    };
  }
}

export class HostItem extends ClickerItem {
  constructor(public readonly host: Host, public readonly parent: HostsItem) {
    super(host.adress);
    super.type = ItemType.host;
    super.description = `TLS: on`;
    if (host.plaintext) {
      super.description = `TLS: off`;
    }
    super.contextValue = `host`;
    const icon = `host-off.svg`;
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", icon),
      dark: path.join(__filename, "..", "..", "images", icon),
    };
    super.collapsibleState = vscode.TreeItemCollapsibleState.None;
  }
}

export class ServiceItem extends ClickerItem {
  constructor(
    public readonly base: Service,
    public readonly parent: FileItem | ServerItem
  ) {
    super(base.name);
    super.type = ItemType.service;
    super.description = base.tag;
    const icon = `svc.svg`;
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", icon),
      dark: path.join(__filename, "..", "..", "images", icon),
    };
    super.tooltip = base.description;
    super.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
  }
}

export class CallItem extends ClickerItem {
  constructor(public readonly base: Call, public readonly parent: ServiceItem) {
    super(base.name);
    super.type = ItemType.call;
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
      path: ``,
      protoName: parent.base.tag.split(`.`).slice(0, -1).join(`.`),
      service: parent.base.name,
      call: base.name,
      callTag: `${parent.base.tag}/${base.name}`,
      inputMessageTag: base.inputMessageTag,
      inputMessageName: base.inputMessageTag.split(`.`).pop()!,
      outputMessageName: base.outputMessageTag.split(`.`).pop()!,
      host: {
        adress: ``,
        plaintext: false,
      },
      json: "",
      maxMsgSize: 0,
      code: "",
      response: "",
      time: "",
      date: "",
      metadata: [],
      hosts: [],
      expectedResponse: "",
      expectedCode: "",
      expectedTime: "",
      testMdResult: "",
      testPassed: undefined,
    };
    if (parent.parent.type === ItemType.file) {
      const file = parent.parent as FileItem;
      request.path = file.base.path;
      request.host = file.base.hosts[0];
      request.hosts = file.base.hosts;
    }
    if (parent.parent.type === ItemType.server) {
      const server = parent.parent as ServerItem;
      request.host.adress = server.base.adress;
      request.host.plaintext = server.base.plaintext;
      request.hosts = [server.base];
    }
    super.command = {
      command: "webview.open",
      title: "Trigger opening of webview for grpc call",
      arguments: [request],
    };
  }
}

export class MessageItem extends ClickerItem {
  constructor(public readonly base: Message, public readonly parent: CallItem) {
    super(base.name);
    super.type = ItemType.message;
    const icon = `msg.svg`;
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

export class FieldItem extends ClickerItem {
  constructor(
    public readonly base: Field,
    public readonly parent: MessageItem
  ) {
    super(base.name);
    super.type = ItemType.field;
    super.tooltip = base.description;
    super.description = base.datatype;
    super.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    if (base.innerMessageTag === undefined && !(base.datatype === `oneof`)) {
      super.collapsibleState = vscode.TreeItemCollapsibleState.None;
    }
    const icon = `field.svg`;
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", icon),
      dark: path.join(__filename, "..", "..", "images", icon),
    };
  }
}

export class HeaderItem extends ClickerItem {
  private iconName = "meta-off.svg";
  constructor(public readonly header: Header) {
    super(header.value);
    super.type = ItemType.header;
    super.tooltip = `Header that will be sent with request metadata in context`;
    super.contextValue = "header";
    super.command = {
      command: "headers.switch",
      title: "Switch grpc host",
      arguments: [header.value],
    };
    if (header.active) {
      this.iconName = "meta-on.svg";
    }
    this.iconPath = {
      light: path.join(__filename, "..", "..", "images", this.iconName),
      dark: path.join(__filename, "..", "..", "images", this.iconName),
    };
  }
}

export class HistoryItem extends ClickerItem {
  constructor(request: RequestData) {
    super(request.call);
    super.description = request.date;
    super.contextValue = "call";
    super.tooltip = new vscode.MarkdownString(`### Request information:
- host for execution: \`${request.host}\`
- method used in request: \`${request.call}\`
- response code: \`${request.code}\`
- time of execution: \`${request.time}\`
- date: \`${request.date}\`

Response:

\`\`\`json
${request.response.split(`\n`).slice(0, 40).join(`\n`)}
\`\`\`
`);
    super.command = {
      command: "webview.open",
      title: "Trigger opening of webview for grpc call",
      arguments: [request],
    };
    let icon = `success.svg`;
    if (request.code !== `OK`) {
      icon = `error.svg`;
    }
    super.iconPath = {
      light: path.join(__filename, "..", "..", "images", icon),
      dark: path.join(__filename, "..", "..", "images", icon),
    };
  }
}
