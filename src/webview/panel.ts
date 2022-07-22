import { request } from "http";
import * as vscode from "vscode";
import { Grpcurl } from "../grpcurl/grpcurl";
import { Input } from "./input";
import { Response } from "./response";

export class GrpcClickerView {
  constructor(private uri: vscode.Uri) {}

  create(input: Input, grpcurl: Grpcurl) {
    const panel = vscode.window.createWebviewPanel(
      "callgrpc",
      "gRPC Request",
      vscode.ViewColumn.Active,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(this.uri, "media")],
      }
    );

    panel.webview.onDidReceiveMessage(
      async (message) => {
        switch (message.command) {
          case "req":
            let resp = await grpcurl.sendCall(
              input.path,
              message.text,
              input.adress,
              input.methodTag,
              false
            );
            panel.webview.postMessage(JSON.stringify(new Response(resp)));
            return;
        }
      },
      null,
      null
    );

    panel.iconPath = {
      light: vscode.Uri.joinPath(this.uri, `images`, `light`, `rocket.svg`),
      dark: vscode.Uri.joinPath(this.uri, `images`, `dark`, `rocket.svg`),
    };

    const scriptUri = panel.webview.asWebviewUri(
      vscode.Uri.joinPath(this.uri, "media", "main.js")
    );
    const stylesMainUri = panel.webview.asWebviewUri(
      vscode.Uri.joinPath(this.uri, "media", "styles.css")
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
      <link href="${stylesMainUri}" rel="stylesheet" />
    </head>
    <body>      
      <div id="app"></div>
      <script
        nonce="W3hIwRHaPGdvqvmwfzGey0vuCz2fM6Pn"
        src="${scriptUri}"
      ></script>
    </body>
  </html>`;

    panel.webview.postMessage(JSON.stringify(input));
  }
}
