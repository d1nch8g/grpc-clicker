import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export class GrpcClickerProvider
  implements vscode.TreeDataProvider<GrpcElement>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    GrpcElement | undefined | void
  > = new vscode.EventEmitter<GrpcElement | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<
    void | GrpcElement | GrpcElement[]
  > = this._onDidChangeTreeData.event;

  // Trigger to update element
  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  //
  getTreeItem(
    element: GrpcElement
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(element?: GrpcElement): vscode.ProviderResult<GrpcElement[]> {
    if (Math.random() > 0.6) {
      return Promise.resolve([]);
    }
    let first = new GrpcElement(
      `test tree`,
      `1`,
      vscode.TreeItemCollapsibleState.None,
      null
    );
    let second = new GrpcElement(
      `test tree 2`,
      `1`,
      vscode.TreeItemCollapsibleState.None,
      null
    );
    let third = new GrpcElement(
      `test tree 3`,
      `1`,
      vscode.TreeItemCollapsibleState.None,
      null
    );
    return Promise.resolve([first, second, third]);
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
