import * as vscode from "vscode";
import { RequestData } from "./treeviews/protos";

export class WebViewFactory {
  private views: GrpcClickerView[] = [];
  constructor(
    private uri: vscode.Uri,
    private callback: (request: RequestData) => Promise<RequestData>
  ) {}

  create(data: RequestData) {
    this.removeClosedPanels();
    for (const view of this.views) {
      const panelIsActive =
        data.path === view.request.path &&
        data.inputMessageName === view.request.inputMessageName &&
        data.outputMessageName === view.request.outputMessageName &&
        data.call === view.request.call;
      if (panelIsActive) {
        view.panel.reveal();
        return;
      }
    }
    const view = new GrpcClickerView(this.uri, data, this.callback);
    this.views.push(view);
  }

  private removeClosedPanels() {
    var i = this.views.length;
    while (i--) {
      if (this.views[i].closed) {
        this.views.splice(i, 1);
        continue;
      }
    }
  }
}

class GrpcClickerView {
  public readonly panel: vscode.WebviewPanel;
  public closed: boolean = false;
  constructor(
    private uri: vscode.Uri,
    public request: RequestData,
    private callback: (request: RequestData) => Promise<RequestData>
  ) {
    this.panel = vscode.window.createWebviewPanel(
      "callgrpc",
      request.call,
      vscode.ViewColumn.Active,
      { enableScripts: true }
    );

    this.panel.webview.onDidReceiveMessage(async (out) => {
      switch (out.command) {
        case "send":
          const updatedRequest = await this.callback(request);
          this.request = updatedRequest;
          this.panel.webview.postMessage(JSON.stringify(request));
          return;
        case "edit":
          request.reqJson = out.text;
          return;
        case "host":
          request.host = out.text;
      }
    });

    this.panel.onDidChangeViewState((e) => {
      if (this.panel.visible) {
        this.update();
      }
    });

    this.panel.onDidDispose(() => {
      this.panel.dispose();
      this.closed = true;
    });

    this.update();
  }

  update() {
    this.panel.iconPath = {
      light: vscode.Uri.joinPath(this.uri, `images`, `rocket.svg`),
      dark: vscode.Uri.joinPath(this.uri, `images`, `rocket.svg`),
    };

    const scriptUri = this.panel.webview.asWebviewUri(
      vscode.Uri.joinPath(this.uri, "dist", "main.js")
    );
    const stylesMainUri = this.panel.webview.asWebviewUri(
      vscode.Uri.joinPath(this.uri, "dist", "styles.css")
    );
    const toolkitUri = this.panel.webview.asWebviewUri(
      vscode.Uri.joinPath(this.uri, "dist", "tk", "toolkit.js")
    );

    this.panel.webview.html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script type="module" src="${toolkitUri}"></script>
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
    this.panel.webview.postMessage(JSON.stringify(this.request));
  }
}
