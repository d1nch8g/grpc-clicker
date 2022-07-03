import * as vscode from "vscode";
import { getNonce } from "./nonce";

export class CallView {
  private panel: vscode.WebviewPanel;
  constructor(context: vscode.ExtensionContext) {
    this.panel = vscode.window.createWebviewPanel(
      `callgrpc`,
      `Grpc call`,
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.joinPath(context.extensionUri, `media`),
        ],
      }
    );

    let js = vscode.Uri.joinPath(context.extensionUri, `media`, `main.js`);

    
  }
}
