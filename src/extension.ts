import * as vscode from "vscode";
import { GrpcClickerProvider, GrpcElement } from "./container";

export function activate(context: vscode.ExtensionContext) {
  const rootPath =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;

  vscode.window.registerTreeDataProvider(
    "grpc-clicker-vscode",
    new GrpcClickerProvider()
  );
}

export function deactivate() {}
