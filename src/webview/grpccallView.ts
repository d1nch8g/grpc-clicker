import { Event, Uri, Webview, WebviewOptions } from "vscode";

export class GrpcCallWebView implements Webview {
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
