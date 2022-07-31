import * as vscode from "vscode";
import * as path from "path";

export class HeadersTreeView implements vscode.TreeDataProvider<HeaderItem> {
  constructor(private metas: Header[]) {
    this.metas = metas;
    this.onChange = new vscode.EventEmitter<HeaderItem | undefined | void>();
    this.onDidChangeTreeData = this.onChange.event;
  }

  private onChange: vscode.EventEmitter<HeaderItem | undefined | void>;
  readonly onDidChangeTreeData: vscode.Event<void | HeaderItem | HeaderItem[]>;

  refresh(metas: Meta[]): void {
    this.metas = metas;
    this.onChange.fire();
  }

  getTreeItem(element: HeaderItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: HeaderItem): vscode.ProviderResult<HeaderItem[]> {
    let hostItems: HeaderItem[] = [];
    for (var meta of this.metas) {
      hostItems.push(new HeaderItem(meta.name, meta.isOn));
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
  constructor(meta: string, isOn: boolean) {
    super(meta);
    super.tooltip = `Meta data that will be sent with request in context`;
    super.contextValue = "meta";
    super.command = {
      command: "metas.switch",
      title: "Switch grpc host",
      arguments: [meta],
    };
    if (isOn) {
      this.iconName = "meta-on.svg";
    }
    this.iconPath = {
      light: path.join(__filename, "..", "..", "images", this.iconName),
      dark: path.join(__filename, "..", "..", "images", this.iconName),
    };
  }
}
