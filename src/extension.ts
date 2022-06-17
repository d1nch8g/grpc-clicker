import * as vscode from "vscode";
import { GrpcClickerProvider, GrpcElement } from "./container";

export function activate(context: vscode.ExtensionContext) {
  const rootPath =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;

  new GrpcElement("test", "1", vscode.TreeItemCollapsibleState.Expanded, null);

  vscode.window.registerTreeDataProvider(
    "grpc-explorer-container",
    new GrpcClickerProvider()
  );
}

export function deactivate() {}
