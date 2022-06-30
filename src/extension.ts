import * as vscode from "vscode";
import { Grpcurl } from "./grpcurl/grpcurl";
import { AdressList as HostsTreeView } from "./hosts/list";
import { ProtosTree as ProtosTreeView } from "./protos/tree";
import * as path from "path";
import * as fs from "fs";
import { Storage } from "./storage/storage";
import { getNonce } from "./nonce";

export async function activate(context: vscode.ExtensionContext) {
  const grpcurl = new Grpcurl();
  const storage = new Storage(context.globalState);

  const hostsView = new HostsTreeView(storage.hosts.list());
  vscode.window.registerTreeDataProvider("hosts", hostsView);

  let protos = await grpcurl.protos(storage.protos.list());
  const protosView = new ProtosTreeView(grpcurl, protos);
  vscode.window.registerTreeDataProvider("protos", protosView);

  vscode.commands.registerCommand("hosts.add", async () => {
    let host = (await vscode.window.showInputBox()) ?? "";
    let hosts = storage.hosts.add(host);
    hostsView.refresh(hosts);
  });

  vscode.commands.registerCommand("hosts.remove", async () => {
    let hosts = storage.hosts.list();
    let host = await vscode.window.showQuickPick(hosts);
    hosts = storage.hosts.remove(host);
    hostsView.refresh(hosts);
  });

  vscode.commands.registerCommand("hosts.switch", async (host: string) => {
    storage.hosts.setCurret(host);
    let msg = `Host for gRPC calls being switched: ${host}`;
    vscode.window.showInformationMessage(msg);
  });

  vscode.commands.registerCommand("protos.add", async () => {
    const options: vscode.OpenDialogOptions = {
      canSelectMany: false,
      openLabel: "Open",
      filters: {
        protoFiles: ["proto"],
      },
    };
    let pick = await vscode.window.showOpenDialog(options);
    let path = pick[0].fsPath;
    let pathes = storage.protos.add(path);
    let protos = await grpcurl.protos(pathes);
    protosView.refresh(protos);
  });

  vscode.commands.registerCommand("protos.remove", async () => {
    let pathes = storage.protos.list();
    let path = await vscode.window.showQuickPick(pathes);
    pathes = storage.protos.remove(path);
    let protos = await grpcurl.protos(pathes);
    protosView.refresh(protos);
  });

  vscode.commands.registerCommand("protos.refresh", async () => {
    let pathes = storage.protos.list();
    let protos = await grpcurl.protos(pathes);
    protosView.refresh(protos);
  });

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

export function deactivate() {}
