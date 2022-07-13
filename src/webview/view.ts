import * as vscode from "vscode";
import * as path from "path";
import {
  Event,
  Uri,
  ViewColumn,
  Webview,
  WebviewPanel,
  WebviewPanelOnDidChangeViewStateEvent,
  WebviewPanelOptions,
} from "vscode";

export class GrpcCallWebViewPanel implements WebviewPanel {
  constructor(
    context: vscode.ExtensionContext,
    viewType: string,
    title: string
  ) {
    this.viewType = viewType;
    this.title = title;

    let svg = vscode.Uri.joinPath(context.extensionUri, "images", "view.svg");
    path.join(__filename, "..", "..", "images", "webview.svg");
    this.iconPath = { light: svg, dark: svg };
  }

  viewType: string;
  title: string;
  iconPath?: Uri | { readonly light: Uri; readonly dark: Uri };
  webview: Webview;
  options: WebviewPanelOptions;
  viewColumn: ViewColumn;
  active: boolean;
  visible: boolean;
  onDidChangeViewState: Event<WebviewPanelOnDidChangeViewStateEvent>;
  onDidDispose: Event<void>;
  reveal(viewColumn?: ViewColumn, preserveFocus?: boolean): void {
    throw new Error("Method not implemented.");
  }
  dispose() {
    throw new Error("Method not implemented.");
  }
}
