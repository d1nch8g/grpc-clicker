import * as vscode from "vscode";
import { getNonce } from "./nonce";

export function activateWebView(context: vscode.ExtensionContext) {
  vscode.commands.registerCommand(
    "call.trigger",
    async (protoPath: string, tag: string) => {
      let msg = `Call have been triggered: ${tag}\r\n ${protoPath}`;
      vscode.window.showInformationMessage(msg);
      const panel = vscode.window.createWebviewPanel(
        "callgrpc",
        "Test panel",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.joinPath(context.extensionUri, "webview", "main.js"),
            vscode.Uri.joinPath(context.extensionUri, "webview", "style.css"),
          ],
        }
      );
      // const htmlPath = vscode.Uri.file(
      //   path.join(context.extensionPath, "webview", "index.html")
      // );
      // let html = fs.readFileSync(htmlPath.fsPath, "utf8");
      // html.replace("main.js", `${scriptUri}`);
      // html.replace("nonce.js", `${nonce}`);
      const nonce = getNonce();
      const scriptUri = panel.webview.asWebviewUri(
        vscode.Uri.joinPath(context.extensionUri, "webview", "main.js")
      );

      panel.webview.html = `<!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
  
                  <!--
                      Use a content security policy to only allow loading images from https or from our extension directory,
                      and only allow scripts that have a specific nonce.
                  -->
                  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${panel.webview.cspSource}; img-src ${panel.webview.cspSource} https:; script-src 'nonce-${nonce}';">
  
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  
                  <title>Cat Coding</title>
              </head>
              <body>
                  <h1 id="lines-of-code-counter">0</h1>
          <button> stfu </button>
                  <script nonce="${nonce}" src="${scriptUri}"></script>
              </body>
              </html>`;
      console.log("triggered");
    }
  );
}
