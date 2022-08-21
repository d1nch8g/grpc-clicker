import * as vscode from "vscode";
import { Response, Expectations, Request } from "./grpcurl/grpcurl";
import { Header } from "./storage/headers";
import { HostsOptions } from "./storage/hosts";

/**
 * Parameters for building all webview tabs.
 */
export interface SharedWebViewParameters {
  /**
   * Base uri to eject source files for webview, should be base of extension
   */
  uri: vscode.Uri;
  /**
   * Callback that is sending request and giving back response, should be
   * executed when `send` button is pressed.
   */
  sendRequest: (request: Request) => Promise<Response>;
  /**
   * Callback that should copy `grpcurl` command to clipboard from webview.
   */
  copyCliCommand: (request: Request) => void;
  /**
   * Callback that is adding test to collection.
   */
  createTest: (request: Request, expect: Expectations) => void;
}

/**
 * Data that is required for building single tab with gRPC call.
 */
export interface WebViewData {
  /**
   * Request to be operated from within webview tab.
   */
  request: Request;
  /**
   * Aditional information that will be displayed to user in INFO panel.
   */
  info: AdditionalInfo;
  /**
   * Request headers.
   */
  headers: Header[];
  /**
   * Host options available for request.
   */
  hosts: HostsOptions;
  /**
   * Response to be visible in webview.
   */
  response: Response | undefined;
  /**
   * Test expectations that could be set in webview.
   */
  expect: Expectations | undefined;
}

/**
 * Information about request.
 */
export interface AdditionalInfo {
  /**
   * Service in which request will be executed.
   */
  service: string;
  /**
   * Human readable call string, that could be displayed to user.
   */
  call: string;
  /**
   * `grpcurl` compatible message tag for request message.
   */
  inputMessageTag: string;
  /**
   * `grpcurl` compatible message tag for response message.
   */
  inputMessageName: string;
  /**
   * Human readable name of outgoing message.
   */
  outputMessageName: string;
  /**
   * Package of proto.
   */
  protoPackage: string;
}

export class WebViewFactory {
  private views: GrpcClickerView[] = [];

  constructor(input: {
    uri: vscode.Uri;
    requestCallback: (data: RequestData) => Promise<RequestData>;
    exportCallback: (data: RequestData) => void;
    addTestCallback: (data: RequestData) => void;
  }) {
    this.uri = input.uri;
    this.requestCallback = input.requestCallback;
    this.exportCallback = input.exportCallback;
    this.addTestCallback = input.addTestCallback;
  }

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
    const view = new GrpcClickerView(
      this.uri,
      data,
      this.requestCallback,
      this.exportCallback,
      this.addTestCallback
    );
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
    private requestCallback: (data: RequestData) => Promise<RequestData>,
    private exportCallback: (data: RequestData) => void,
    private addTestCallback: (data: RequestData) => void
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
          const updatedRequest = await this.requestCallback(this.request);
          this.request = updatedRequest;
          this.panel.webview.postMessage(JSON.stringify(this.request));
          return;
        case "change":
          this.request = JSON.parse(out.text);
          return;
        case "export":
          this.exportCallback(this.request);
          return;
        case "test":
          this.addTestCallback(this.request);
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
      light: vscode.Uri.joinPath(this.uri, `images`, `unary.svg`),
      dark: vscode.Uri.joinPath(this.uri, `images`, `unary.svg`),
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
