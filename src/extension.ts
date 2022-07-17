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

  vscode.commands.registerCommand("call.trigger", async () => {
    const panel = vscode.window.createWebviewPanel(
      "callgrpc",
      "gRPC call",
      vscode.ViewColumn.Active,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.joinPath(context.extensionUri, "media"),
        ],
      }
    );

    panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case "alert":
            vscode.window.showErrorMessage(message.text);
            return;
        }
      },
      null,
      null
    );

    let uri = context.extensionUri;
    panel.iconPath = {
      light: vscode.Uri.joinPath(uri, `images`, `light`, `rocket.svg`),
      dark: vscode.Uri.joinPath(uri, `images`, `dark`, `rocket.svg`),
    };

    const scriptUri = panel.webview.asWebviewUri(
      vscode.Uri.joinPath(context.extensionUri, "media", "main.js")
    );
    const stylesResetUri = panel.webview.asWebviewUri(
      vscode.Uri.joinPath(context.extensionUri, "media", "reset.css")
    );
    const stylesMainUri = panel.webview.asWebviewUri(
      vscode.Uri.joinPath(context.extensionUri, "media", "vscode.css")
    );

    panel.webview.html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'none'; style-src ${panel.webview.cspSource}; img-src ${panel.webview.cspSource} https:; script-src 'nonce-W3hIwRHaPGdvqvmwfzGey0vuCz2fM6Pn';"
    />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="${stylesResetUri}" rel="stylesheet" />
    <link href="${stylesMainUri}" rel="stylesheet" />
    <title>Cat Coding</title>
  </head>
  <body>
    <img src="https://grpc.io/img/logos/grpc-icon-color.png" width="300" />
    <h1> Grpc clicker panel </h1>
    <input />
    <button> Send call </button>
    <script
      nonce="W3hIwRHaPGdvqvmwfzGey0vuCz2fM6Pn"
      src="${scriptUri}"
    ></script>
  </body>
</html>`;

    panel.webview.postMessage("🐛 ola es me");
  });
}

export function deactivate() {}
