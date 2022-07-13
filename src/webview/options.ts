import * as vscode from "vscode";
import { WebviewOptions } from "vscode";

export class GrpcCallWebViewOptions implements WebviewOptions {
  readonly enableScripts?: boolean;
  readonly enableForms?: boolean;
  readonly enableCommandUris?: boolean;
  readonly localResourceRoots?: readonly vscode.Uri[];
  readonly portMapping?: readonly vscode.WebviewPortMapping[];
  constructor(context: vscode.ExtensionContext) {
    this.enableScripts = true;
    this.enableForms = true;
    this.enableCommandUris = true;
    this.localResourceRoots = [
      vscode.Uri.joinPath(context.extensionUri, "webview", "style.css"),
      vscode.Uri.joinPath(context.extensionUri, "webview", "script.js"),
      vscode.Uri.joinPath(context.extensionUri, "webview", "index.html"),
    ];
  }
}
