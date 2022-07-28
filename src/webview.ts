import * as vscode from "vscode";
import { Request } from "./classes/request";

export class WebViewFactory {
  private views: GrpcClickerView[] = [];
  constructor(
    private uri: vscode.Uri,
    private callback: (request: Request) => Promise<Request>
  ) {}

  create(request: Request) {
    this.removeClosedPanels();
    for (const view of this.views) {
      const panelIsActive =
        request.path === view.request.path &&
        request.proto === view.request.proto &&
        request.service === view.request.service &&
        request.call === view.request.call &&
        request.methodTag === view.request.methodTag;
      if (panelIsActive) {
        view.panel.reveal();
        return;
      }
    }
    const view = new GrpcClickerView(this.uri, request, this.callback);
    this.views.push(view);
  }

  update(host: string) {
    this.removeClosedPanels();
    for (const view of this.views) {
      view.request.host = host;
      view.update();
    }
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
    public request: Request,
    private callback: (request: Request) => Promise<Request>
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
      light: vscode.Uri.joinPath(this.uri, `images`, `view.svg`),
      dark: vscode.Uri.joinPath(this.uri, `images`, `view.svg`),
    };

    const scriptUri = this.panel.webview.asWebviewUri(
      vscode.Uri.joinPath(this.uri, "dist", "main.js")
    );
    const stylesMainUri = this.panel.webview.asWebviewUri(
      vscode.Uri.joinPath(this.uri, "dist", "styles.css")
    );
    const toolkitUri = this.panel.webview.asWebviewUri(
      vscode.Uri.joinPath(
        this.uri,
        "node_modules",
        "@vscode",
        "webview-ui-toolkit",
        "dist",
        "toolkit.js"
      )
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
