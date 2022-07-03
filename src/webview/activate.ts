import * as vscode from "vscode";
import { getNonce } from "./nonce";

export class CallView {
  private panel: vscode.WebviewPanel;
  constructor(private context: vscode.ExtensionContext) {
    this.panel = vscode.window.createWebviewPanel(
      `callgrpc`,
      `Grpc call`,
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [this.vscodeUri(`media`)],
      }
    );

    let scriptPath = this.vscodeUri(`media`, `main.js`);
    let cssPath = this.vscodeUri(`media`, `vscode.css`);
  }

  private vscodeUri(...pathes: string[]): vscode.Uri {
    return vscode.Uri.joinPath(this.context.extensionUri, ...pathes);
  }
}
