import * as vscode from "vscode";
import { Grpcurl } from "./grpcurl/grpcurl";
import { AdressList as HostsTreeView } from "./hosts/list";
import { MetasList } from "./metas/list";
import { ProtosTree as ProtosTreeView } from "./protos/tree";
import { Storage } from "./storage/storage";

export async function activate(context: vscode.ExtensionContext) {
  const grpcurl = new Grpcurl();
  const storage = new Storage(context.globalState);

  const hostsView = new HostsTreeView(storage.hosts.listAsHosts());
  vscode.window.registerTreeDataProvider("hosts", hostsView);

  const protos = await grpcurl.protos(storage.protos.list());
  const protosView = new ProtosTreeView(grpcurl, protos);
  vscode.window.registerTreeDataProvider("protos", protosView);

  const metasList = new MetasList(storage.metas.listMetas());
  vscode.window.registerTreeDataProvider("metas", metasList);

  vscode.commands.registerCommand("hosts.add", async () => {
    let host = (await vscode.window.showInputBox()) ?? "";
    let hosts = storage.hosts.add(host);
    hostsView.refresh(hosts);
  });

  vscode.commands.registerCommand("hosts.remove", async () => {
    let hosts = storage.hosts.list();
    let host = await vscode.window.showQuickPick(hosts);
    let newHosts = storage.hosts.remove(host);
    hostsView.refresh(newHosts);
  });

  vscode.commands.registerCommand("hosts.switch", async (host: string) => {
    let newHosts = storage.hosts.setCurret(host);
    hostsView.refresh(newHosts);
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

  vscode.commands.registerCommand("call.trigger", async () => {
    vscode.window.showInformationMessage(`call triggered`);
    let metas = storage.metas.listMetas();
    metasList.refresh(metas);

    new CatCodingPanel(context.extensionUri);
  });

  vscode.commands.registerCommand("metas.add", async () => {
    let meta = (await vscode.window.showInputBox()) ?? "";
    let metas = storage.metas.add(meta);
    metasList.refresh(metas);
  });

  vscode.commands.registerCommand("metas.remove", async () => {
    let metas = storage.metas.list();
    let meta = await vscode.window.showQuickPick(metas);
    let newMetas = storage.metas.remove(meta);
    metasList.refresh(newMetas);
  });

  vscode.commands.registerCommand("metas.switch", async (meta: string) => {
    storage.metas.switchOnOff(meta);
    let metas = storage.metas.listMetas();
    metasList.refresh(metas);
  });

  if (vscode.window.registerWebviewPanelSerializer) {
    vscode.window.registerWebviewPanelSerializer("callgrpc", {
      async deserializeWebviewPanel(
        webviewPanel: vscode.WebviewPanel,
        state: any
      ) {
        console.log(`Got state: ${state}`);
        webviewPanel.webview.options = {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.joinPath(context.extensionUri, "media"),
          ],
        };
        new CatCodingPanel(context.extensionUri);
      },
    });
  }
}

export function deactivate() {}

class CatCodingPanel {
  public static currentPanel: CatCodingPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];
  private catGif = "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif";

  constructor(extensionUri: vscode.Uri) {
    this._panel = vscode.window.createWebviewPanel(
      "callgrpc",
      "Cat Coding",
      vscode.ViewColumn.Active,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, "media")],
      }
    );
    this._extensionUri = extensionUri;
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    this._panel.onDidChangeViewState((e) => {}, null, this._disposables);
    this._panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case "alert":
            vscode.window.showErrorMessage(message.text);
            return;
        }
      },
      null,
      this._disposables
    );

    this._panel.title = "gRPC call";

    const scriptPathOnDisk = vscode.Uri.joinPath(
      this._extensionUri,
      "media",
      "main.js"
    );

    const scriptUri = this._panel.webview.asWebviewUri(scriptPathOnDisk);

    const styleResetPath = vscode.Uri.joinPath(
      this._extensionUri,
      "media",
      "reset.css"
    );

    const stylesPathMainPath = vscode.Uri.joinPath(
      this._extensionUri,
      "media",
      "vscode.css"
    );

    const stylesResetUri = this._panel.webview.asWebviewUri(styleResetPath);
    const stylesMainUri = this._panel.webview.asWebviewUri(stylesPathMainPath);

    let nonce = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
      nonce += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    this._panel.webview.html = `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${this._panel.webview.cspSource}; img-src ${this._panel.webview.cspSource} https:; script-src 'nonce-${nonce}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${stylesResetUri}" rel="stylesheet">
				<link href="${stylesMainUri}" rel="stylesheet">

				<title>Cat Coding</title>
			</head>
			<body>
				<img src="${this.catGif}" width="300" />
				<h1 id="lines-of-code-counter">0</h1>

				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
  }

  public doRefactor() {
    this._panel.webview.postMessage({ command: "refactor" });
  }

  public dispose() {
    CatCodingPanel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }
}
