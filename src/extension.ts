import * as vscode from "vscode";
import { NodeDependenciesProvider } from "./nodeDep";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "grpc-clicker" is now active!');
  let disposable = vscode.commands.registerCommand(
    "grpc-clicker.helloWorld",
    () => {
      vscode.window.showErrorMessage("Hello VSCode!");
    }
  );
  const rootPath =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;
  vscode.window.registerTreeDataProvider(
    "nodeDependencies",
    new NodeDependenciesProvider(rootPath!)
  );
}

export function deactivate() {}
