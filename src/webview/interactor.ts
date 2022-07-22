import * as vscode from "vscode";

export class Interactor {
  constructor(private webview: vscode.Webview) {
    this.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case "alert":
            vscode.window.showErrorMessage(message.text);
            return;
        }
      },
      null,
      null
    );
  }
}

export class CreateViewMessage {}
