import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "grpc-clicker" is now active!');

  let disposable = vscode.commands.registerCommand(
    "grpc-clicker.helloWorld",
    () => {
      vscode.window.showInformationMessage("Hello World from grpc_clicker!");
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
