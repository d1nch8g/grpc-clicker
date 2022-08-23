import * as vscode from "vscode";
import { Response, Expectations, Request } from "./grpcurl/grpcurl";
import { Header } from "./storage/headers";
import { AdditionalInfo } from "./storage/history";
import { Host } from "./storage/hosts";

/**
 * Parameters for building all webview tabs.
 */
export interface WebViewParameters {
  /**
   * Base uri to eject source files for webview, should be base of extension
   */
  uri: vscode.Uri;
  /**
   * Callback that is sending request and giving back response, should be
   * executed when `send` button is pressed.
   */
  sendRequest: (request: Request, info: AdditionalInfo) => Promise<Response>;
  /**
   * Callback that should copy `grpcurl` command to clipboard from webview.
   */
  copyCliCommand: (request: Request) => void;
  /**
   * Callback that is adding test to collection.
   */
  createTest: (request: Request, expect: Expectations | undefined) => void;
  /**
   * Callback that is sent to manage hosts for webview.
   */
  manageHosts: () => Promise<Host[]>;
  /**
   * Callback for adding new header.
   */
  addHeader: () => Promise<Header[]>;
  /**
   * Callback for removing header header.
   */
  removeHeader: () => Promise<Header[]>;
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
  hosts: Host[];
  /**
   * Response to be visible in webview.
   */
  response: Response;
  /**
   * Test expectations that could be set in webview.
   */
  expectations: Expectations;
}

/**
 * Factory managing all grpc clicker request tabs.
 */
export class WebViewFactory {
  private tabs: GrpcClickerTab[] = [];

  constructor(private params: WebViewParameters) {}

  /**
   * Operation that will try to reveal existing panel with same params and
   * create new tab for grpc call if such is not found.
   */
  createNewTab(data: WebViewData) {
    this.removeClosedPanels();
    if (!this.tryToReveal(data.info)) {
      this.tabs.push(new GrpcClickerTab(this.params, data));
    }
  }

  /**
   * Helper method that checks wether panel similaer request params exists.
   * Will be used to reveal existing panel if such exists in webviews.
   * Will return `true` if panel successfully revealed.
   */
  private tryToReveal(info: AdditionalInfo): boolean {
    for (const tab of this.tabs) {
      if (
        info.service === tab.data.info.service &&
        info.call === tab.data.info.call &&
        info.inputMessageTag === tab.data.info.inputMessageTag &&
        info.protoPackage === tab.data.info.protoPackage
      ) {
        tab.panel.reveal();
        return true;
      }
    }
    return false;
  }

  /**
   * Helper method to remove all unused webview panels.
   */
  private removeClosedPanels() {
    var i = this.tabs.length;
    while (i--) {
      if (this.tabs[i].closed) {
        this.tabs.splice(i, 1);
        continue;
      }
    }
  }
}

/**
 * Single tab instance of tag for grpc calls.
 */
class GrpcClickerTab {
  public readonly panel: vscode.WebviewPanel;
  public closed: boolean = false;

  constructor(private params: WebViewParameters, public data: WebViewData) {
    this.panel = vscode.window.createWebviewPanel(
      "callgrpc",
      data.info.call,
      vscode.ViewColumn.Active,
      { enableScripts: true }
    );

    // Handler for messages coming from webview
    this.panel.webview.onDidReceiveMessage(async (out) => {
      switch (out.command) {
        case "change":
          this.data = JSON.parse(out.text);
          return;
        case "send":
          const response = await this.params.sendRequest(
            this.data.request,
            this.data.info
          );
          this.data.response = response;
          this.panel.webview.postMessage(JSON.stringify(this.data));
          return;
        case "export":
          this.params.copyCliCommand(this.data.request);
          return;
        case "hosts":
          this.data.hosts = await this.params.manageHosts();
          this.panel.webview.postMessage(JSON.stringify(this.data));
          return;
        case "test":
          this.params.createTest(this.data.request, this.data.expectations);
          return;
        case "addHeader":
          this.data.headers = await this.params.addHeader();
          this.panel.webview.postMessage(JSON.stringify(this.data));
          return;
        case "removeHeader":
          this.data.headers = await this.params.removeHeader();
          this.panel.webview.postMessage(JSON.stringify(this.data));
          return;
      }
    });

    // Handler for changes of view state
    this.panel.onDidChangeViewState((e) => {
      if (this.panel.visible) {
        this.reveal();
      }
    });

    this.panel.onDidDispose(() => {
      this.panel.dispose();
      this.closed = true;
    });

    this.reveal();
  }

  /**
   * Method reveal tab with current parameters.
   */
  reveal() {
    this.panel.iconPath = {
      light: vscode.Uri.joinPath(this.params.uri, `images`, `unary.svg`),
      dark: vscode.Uri.joinPath(this.params.uri, `images`, `unary.svg`),
    };

    const scriptUri = this.panel.webview.asWebviewUri(
      vscode.Uri.joinPath(this.params.uri, "dist", "main.js")
    );
    const stylesMainUri = this.panel.webview.asWebviewUri(
      vscode.Uri.joinPath(this.params.uri, "dist", "styles.css")
    );
    const toolkitUri = this.panel.webview.asWebviewUri(
      vscode.Uri.joinPath(this.params.uri, "dist", "tk", "toolkit.js")
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

    this.panel.webview.postMessage(JSON.stringify(this.data));
  }
}
