import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export class GrpcClickerProvider
  implements vscode.TreeDataProvider<GrpcElement>
{
  // Trigger to update element
  onDidChangeTreeData?: vscode.Event<void | GrpcElement | GrpcElement[]>;

  //
  getTreeItem(
    element: GrpcElement
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    throw new Error("Method not implemented.");
  }

  getChildren(element?: GrpcElement): vscode.ProviderResult<GrpcElement[]> {
    throw new Error("Method not implemented.");
  }

  getParent?(element: GrpcElement): vscode.ProviderResult<GrpcElement> {
    throw new Error("Method not implemented.");
  }

  resolveTreeItem?(
    item: vscode.TreeItem,
    element: GrpcElement,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TreeItem> {
    throw new Error("Method not implemented.");
  }
}

export class GrpcElement extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    private readonly version: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}-${this.version}`;
    this.description = this.version;
  }

  iconPath = {
    light: path.join(__filename, "..", "..", "images", "go.svg"),
    dark: path.join(__filename, "..", "..", "images", "go.svg"),
  };

  contextValue = "gRPC Item";
}
