import * as vscode from "vscode";
import * as path from "path";
import { Meta } from "../classes/meta";

export class MetadataTreeView implements vscode.TreeDataProvider<MetaItem> {
  constructor(private metas: Meta[]) {
    this.metas = metas;
    this.onChange = new vscode.EventEmitter<MetaItem | undefined | void>();
    this.onDidChangeTreeData = this.onChange.event;
  }

  private onChange: vscode.EventEmitter<MetaItem | undefined | void>;
  readonly onDidChangeTreeData: vscode.Event<void | MetaItem | MetaItem[]>;

  refresh(metas: Meta[]): void {
    this.metas = metas;
    this.onChange.fire();
  }

  getTreeItem(element: MetaItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: MetaItem): vscode.ProviderResult<MetaItem[]> {
    let hostItems: MetaItem[] = [];
    for (var meta of this.metas) {
      hostItems.push(new MetaItem(meta.name, meta.isOn));
    }
    return hostItems;
  }

  getParent?(element: MetaItem): vscode.ProviderResult<MetaItem> {
    throw new Error("Method not implemented.");
  }

  resolveTreeItem?(
    item: vscode.TreeItem,
    element: MetaItem,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TreeItem> {
    return element;
  }
}

class MetaItem extends vscode.TreeItem {
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
