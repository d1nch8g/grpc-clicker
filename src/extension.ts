import * as vscode from "vscode";
import { GrpcClickerProvider, GrpcElement } from "./container";

export function activate(context: vscode.ExtensionContext) {
  const rootPath =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;

  var stuff = vscode.window.registerTreeDataProvider(
    "grpc-explorer-view",
    new GrpcClickerProvider()
  );
}

export function deactivate() {}
