import * as vscode from "vscode";
import { PanelRequest } from "./request";

export class GrpcClickerView {
  constructor(private uri: vscode.Uri) {}

  create(request: PanelRequest) {
    const panel = vscode.window.createWebviewPanel(
      "callgrpc",
      "gRPC call",
      vscode.ViewColumn.Active,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(this.uri, "media")],
      }
    );

    panel.iconPath = {
      light: vscode.Uri.joinPath(this.uri, `images`, `light`, `rocket.svg`),
      dark: vscode.Uri.joinPath(this.uri, `images`, `dark`, `rocket.svg`),
    };

    const scriptUri = panel.webview.asWebviewUri(
      vscode.Uri.joinPath(this.uri, "media", "main.js")
    );
    const stylesResetUri = panel.webview.asWebviewUri(
      vscode.Uri.joinPath(this.uri, "media", "reset.css")
    );
    const stylesMainUri = panel.webview.asWebviewUri(
      vscode.Uri.joinPath(this.uri, "media", "vscode.css")
    );

    panel.webview.html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta
        http-equiv="Content-Security-Policy"
        content="default-src 'none'; style-src ${panel.webview.cspSource}; img-src ${panel.webview.cspSource} https:; script-src 'nonce-W3hIwRHaPGdvqvmwfzGey0vuCz2fM6Pn';"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link href="${stylesResetUri}" rel="stylesheet" />
      <link href="${stylesMainUri}" rel="stylesheet" />
      <title>Cat Coding</title>
    </head>
    <body>
      <img src="https://grpc.io/img/logos/grpc-icon-color.png" width="300" />
      <h1> Grpc clicker panel </h1>
      <input />
      <button> Send call </button>
      <script
        nonce="W3hIwRHaPGdvqvmwfzGey0vuCz2fM6Pn"
        src="${scriptUri}"
      ></script>
    </body>
  </html>`;

    panel.webview.postMessage(request.toString());

    panel.webview.onDidReceiveMessage(
      (output: string) => {
        const request = new PanelRequest(output);
        vscode.window.showInformationMessage(request.message);
      },
      null,
      null
    );
  }
}
