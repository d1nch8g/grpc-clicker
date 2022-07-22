import { request } from "http";
import * as vscode from "vscode";
import { Grpcurl } from "../grpcurl/grpcurl";
import { Input } from "./input";
import { Response } from "./response";

export class WebViewFactory {
  constructor(private uri: vscode.Uri, private grpcurl: Grpcurl) {}

  create(input: Input) {
    new GrpcClickerView(this.uri, input, this.grpcurl);
  }
}

class GrpcClickerView {
  private panel: vscode.WebviewPanel;
  constructor(private uri: vscode.Uri, private input: Input, grpcurl: Grpcurl) {
    this.panel = vscode.window.createWebviewPanel(
      "callgrpc",
      input.call,
      vscode.ViewColumn.Active,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(this.uri, "media")],
      }
    );

    this.panel.webview.onDidReceiveMessage(
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
            this.panel.webview.postMessage(JSON.stringify(new Response(resp)));
            return;
        }
      },
      null,
      null
    );

    this.panel.onDidChangeViewState(
      (e) => {
        if (this.panel.visible) {
          this.init();
        }
      },
      null,
      null
    );

    this.init();
  }

  private init() {
    this.panel.iconPath = {
      light: vscode.Uri.joinPath(this.uri, `images`, `view.svg`),
      dark: vscode.Uri.joinPath(this.uri, `images`, `view.svg`),
    };

    const scriptUri = this.panel.webview.asWebviewUri(
      vscode.Uri.joinPath(this.uri, "media", "main.js")
    );
    const stylesMainUri = this.panel.webview.asWebviewUri(
      vscode.Uri.joinPath(this.uri, "media", "styles.css")
    );

    this.panel.webview.html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta
        http-equiv="Content-Security-Policy"
        content="default-src 'none'; style-src ${this.panel.webview.cspSource}; img-src ${this.panel.webview.cspSource} https:; script-src 'nonce-W3hIwRHaPGdvqvmwfzGey0vuCz2fM6Pn';"
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

    this.panel.webview.postMessage(JSON.stringify(this.input));
  }
}
