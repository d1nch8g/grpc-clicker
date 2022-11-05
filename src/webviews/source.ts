import * as vscode from "vscode";
import { FileSource, ServerSource } from "../grpcurl/caller";
import { Response, Expectations, Request } from "../grpcurl/grpcurl";
import { Header } from "../storage/headers";
import { AdditionalInfo } from "../storage/history";
import { Host } from "../storage/hosts";

/**
 * Parameters for building all webview tabs.
 */
export interface SourceWebViewParameters {
  /**
   * Base uri to eject source files for webview, should be base of extension
   */
  uri: vscode.Uri;
  /**
   * Source for building a webview, should be passed with default values.
   */
  source: FileSource | ServerSource;
}

/**
 * Data that is required for building single tab with gRPC call.
 */
export interface SourceWebViewData {
  /**
   * Source for building a webview,
   */
  source: FileSource | ServerSource;
}

/**
 * Factory managing webview creation tabs.
 */
export class SourceWebViewFactory {
  private tabs: GrpcClickerTab[] = [];

  constructor(private params: SourceWebViewParameters) {}

  /**
   * Operation that will try to reveal existing panel with same params and
   * create new tab for grpc call if such is not found.
   */
  createNewTab(data: SourceWebViewData) {
    this.removeClosedPanels();
    if (!this.tryToReveal(data.source)) {
      this.tabs.push(new GrpcClickerTab(this.params, data));
    }
  }

  /**
   * Helper method that checks wether panel similaer request params exists.
   * Will be used to reveal existing panel if such exists in webviews.
   * Will return `true` if panel successfully revealed.
   */
  private tryToReveal(source: FileSource | ServerSource): boolean {
    for (const tab of this.tabs) {
      if (JSON.stringify(source) === JSON.stringify(tab.data.source)) {
        tab.panel.reveal();
        return true;
      }
    }
    return false;
  }

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

  constructor(
    private params: SourceWebViewParameters,
    public data: SourceWebViewData
  ) {
    this.panel = vscode.window.createWebviewPanel(
      "callgrpc",
      `gRPC source`,
      vscode.ViewColumn.Active,
      { enableScripts: true }
    );

    // Handler for messages coming from webview
    this.panel.webview.onDidReceiveMessage(async (out) => {
      switch (out.command) {
        case "change":
          this.data = JSON.parse(out.text);
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
      vscode.Uri.joinPath(this.params.uri, "dist", "source.js")
    );
    const stylesMainUri = this.panel.webview.asWebviewUri(
      vscode.Uri.joinPath(this.params.uri, "dist", "source.css")
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
