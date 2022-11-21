import * as vscode from "vscode";
import * as path from "path";
import { Service, Call, Message, Field, ProtoSchema } from "../grpcurl/parser";
import { Header } from "../storage/headers";
import { Collection, Test } from "../storage/collections";
import { HistoryValue } from "../storage/history";
import { Proto } from "../grpcurl/grpcurl";

/**
 * Params that can be used to create new call from pressed button:
 * - call
 * - service
 * - proto
 * - source
 */
export interface GrpcTabFromScratch {
  call: Call;
  service: Service;
  proto: Proto;
}


export enum ItemType {
  unknown,
  file,
  server,
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
  constructor(
    public readonly base: Test,
    public readonly parent: CollectionItem
  ) {
    super(`${base.request.callTag}`);
    super.type = ItemType.test;
    super.contextValue = `test`;
    super.collapsibleState = vscode.TreeItemCollapsibleState.None;
    if (base.result === undefined) {
      super.iconPath = new vscode.ThemeIcon("testing-unset-icon");
      return;
    }
    if (base.result.passed) {
      super.iconPath = new vscode.ThemeIcon(`testing-passed-icon`);
      super.tooltip = new vscode.MarkdownString(`Test passed`);
      return;
    }
    super.iconPath = new vscode.ThemeIcon(`testing-failed-icon`);
    let mdtooltip = `## Test errors:\n\n\n`;
    for (const mistake of base.result.mistakes) {
      switch (mistake.type) {
        case `code`:
          mdtooltip += `- Actual code: ${mistake.actual} vs ${mistake.expected}`;
        case `time`:
          mdtooltip += `- Actual time: ${mistake.actual} vs ${mistake.expected}`;
        case `content`:
          mdtooltip += `- Actual response:\n\n
Actual:
\`\`\`json
${mistake.actual.split(`\n`).slice(0, 14).join(`\n`)}
\`\`\`
Expected:
\`\`\`json 
${mistake.expected.split(`\n`).slice(0, 14).join(`\n`)}
\`\`\`\n\n\n`;
      }
    }
    super.tooltip = new vscode.MarkdownString(mdtooltip);
  }
}

export class ProtoItem extends ClickerItem {
  constructor(public readonly proto: Proto) {
    let name = ``;
    if (proto.source.filePath !== undefined) {
      name = proto.source.filePath.replace(/^.*[\\\/]/, "");
    } else {
      name = proto.source.currentHost;
    }
    super(name);

    if (proto.source.filePath !== undefined) {
      super.type = ItemType.file;
      super.tooltip = new vscode.MarkdownString(`#### Proto file:
  - File path: ${proto.source.filePath}
  - Import paths: ${proto.source.importPaths}`);
      super.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
      super.contextValue = `file`;
      const icon = `file.svg`;
      super.iconPath = {
        light: path.join(__filename, "..", "..", "images", icon),
        dark: path.join(__filename, "..", "..", "images", icon),
      };
    } else {
      super.type = ItemType.server;
      super.description = `TLS: on`;
      if (proto.source.plaintext) {
        super.description = `TLS: off`;
      }
      super.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
      super.contextValue = `server`;
      let icon = `host-on.svg`;
      if (proto.schema.services.length === 0) {
        super.collapsibleState = vscode.TreeItemCollapsibleState.None;
        icon = `host-down.svg`;
      }
      super.iconPath = {
        light: path.join(__filename, "..", "..", "images", icon),
        dark: path.join(__filename, "..", "..", "images", icon),
      };
    }
  }
}

export class ServiceItem extends ClickerItem {
  constructor(
    public readonly base: Service,
    public readonly parent: ProtoItem
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

    const callParams: GrpcTabFromScratch = {
      call: this.base,
      service: parent.base,
      proto: parent.parent.proto,
    };

    super.command = {
      command: "webview.open",
      title: "Trigger opening of webview for grpc call",
      arguments: [callParams],
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
    super.tooltip = `Header that will be sent with request in context`;
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
  constructor(value: HistoryValue) {
    super(value.request.callTag);
    super.description = value.response.date;
    super.contextValue = "call";
    super.tooltip = new vscode.MarkdownString(`### Request information:
- host for execution: \`${value.request.source.currentHost}\`
- method used in request: \`${value.request.callTag}\`
- response code: \`${value.response.code}\`
- time of execution: \`${value.response.time}\`
- date: \`${value.response.date}\`

Response:

\`\`\`json
${value.request.content.split(`\n`).slice(0, 14).join(`\n`)}
\`\`\`
`);

    super.command = {
      command: "history.open",
      title: "Trigger opening of webview for grpc call",
      arguments: [value],
    };
    super.iconPath = new vscode.ThemeIcon(`testing-passed-icon`);
    if (value.response.code !== `OK`) {
      super.iconPath = new vscode.ThemeIcon(`testing-failed-icon`);
    }
  }
}
