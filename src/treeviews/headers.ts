import * as vscode from "vscode";
import * as path from "path";
import { Header } from "../storage/headers";

export class HeadersTreeView implements vscode.TreeDataProvider<HeaderItem> {
  constructor(private headers: Header[]) {
    this.headers = headers;
    this.onChange = new vscode.EventEmitter<HeaderItem | undefined | void>();
    this.onDidChangeTreeData = this.onChange.event;
  }

  private onChange: vscode.EventEmitter<HeaderItem | undefined | void>;
  readonly onDidChangeTreeData: vscode.Event<void | HeaderItem | HeaderItem[]>;

  refresh(headers: Header[]): void {
    this.headers = headers;
    this.onChange.fire();
  }

  getTreeItem(element: HeaderItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: HeaderItem): vscode.ProviderResult<HeaderItem[]> {
    let hostItems: HeaderItem[] = [];
    for (var header of this.headers) {
      hostItems.push(new HeaderItem(header));
    }
    return hostItems;
  }

  getParent?(element: HeaderItem): vscode.ProviderResult<HeaderItem> {
    throw new Error("Method not implemented.");
  }

  resolveTreeItem?(
    item: vscode.TreeItem,
    element: HeaderItem,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TreeItem> {
    return element;
  }
}

class HeaderItem extends vscode.TreeItem {
  private iconName = "meta-off.svg";
  constructor(header: Header) {
    super(header.value);
    super.tooltip = `Meta data that will be sent with request in context`;
    super.contextValue = "meta";
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
