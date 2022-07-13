import * as vscode from "vscode";
import { Event, Uri, Webview, WebviewOptions } from "vscode";
import { GrpcCallWebViewOptions } from "./options";

export class GrpcCallWebView implements Webview {
  constructor(context: vscode.ExtensionContext) {
    this.options = new GrpcCallWebViewOptions(context);
    
  }

  options: WebviewOptions;
  html: string;
  onDidReceiveMessage: Event<any>;
  postMessage(message: any): Thenable<boolean> {
    throw new Error("Method not implemented.");
  }
  asWebviewUri(localResource: Uri): Uri {
    throw new Error("Method not implemented.");
  }
  cspSource: string;
}
