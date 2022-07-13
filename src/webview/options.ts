import * as vscode from "vscode";
import { WebviewOptions } from "vscode";
import { GrpcCallPortMapping } from "./ports";

export class GrpcCallWebViewOptions implements WebviewOptions {
  constructor(context: vscode.ExtensionContext) {
    this.enableScripts = true;
    this.enableForms = true;
    this.enableCommandUris = true;
    this.localResourceRoots = [
      vscode.Uri.joinPath(context.extensionUri, "webview", "styles.css"),
      vscode.Uri.joinPath(context.extensionUri, "webview", "script.js"),
      vscode.Uri.joinPath(context.extensionUri, "webview", "index.html"),
    ];
    this.portMapping = [new GrpcCallPortMapping()];
  }

  readonly enableScripts?: boolean;
  readonly enableForms?: boolean;
  readonly enableCommandUris?: boolean;
  readonly localResourceRoots?: readonly vscode.Uri[];
  readonly portMapping?: readonly vscode.WebviewPortMapping[];
}
