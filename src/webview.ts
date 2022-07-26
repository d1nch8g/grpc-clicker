import * as vscode from "vscode";
import { Request } from "./classes/request";
import { Grpcurl } from "./grpcurl";

export class WebViewFactory {
  private views: GrpcClickerView[] = [];
  constructor(
    private uri: vscode.Uri,
    private grpcurl: Grpcurl,
    private callback: (request: Request) => void
  ) {}

  create(input: Request) {
    this.removeClosedPanels();
    for (const view of this.views) {
      const panelIsActive =
        input.path === view.input.path &&
        input.proto === view.input.proto &&
        input.version === view.input.version &&
        input.service === view.input.service &&
        input.call === view.input.call &&
        input.methodTag === view.input.methodTag;
      if (panelIsActive) {
        view.panel.reveal();
        return;
      }
    }
    const view = new GrpcClickerView(
      this.uri,
      input,
      this.callback,
      this.grpcurl
    );
    this.views.push(view);
  }

  update(host: string) {
    this.removeClosedPanels();
    for (const view of this.views) {
      view.input.host = host;
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
    public input: Request,
    private callback: (request: Request) => void,
    grpcurl: Grpcurl
  ) {
    const options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.uri, "dist")],
    };

    this.panel = vscode.window.createWebviewPanel(
      "callgrpc",
      input.call,
      vscode.ViewColumn.Active,
      options
    );

    this.panel.webview.onDidReceiveMessage(async (out) => {
      switch (out.command) {
        case "req":
          let [resp, error] = await grpcurl.send(
            input.path,
            out.text,
            input.host,
            input.methodTag,
            false
          );
          input.response = resp;
          input.error = error;
          const dateTime = new Date();
          input.date = dateTime.toUTCString();
          this.panel.webview.postMessage(JSON.stringify(input));
          this.callback(input);
          return;
        case "input":
          input.reqJson = out.text;
          return;
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
