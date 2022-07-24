import * as vscode from "vscode";
import { Request } from "./classes/request";
import { Grpcurl } from "./grpcurl";
import { Storage } from "./storage/storage";
import { TreeViews } from "./treeviews/treeviews";
import { WebViewFactory } from "./webview";

export function activate(context: vscode.ExtensionContext) {
  const storage = new Storage(context.globalState);

  const grpcurl = new Grpcurl(storage);

  const treeviews = new TreeViews(
    storage.hosts.hosts(),
    storage.metas.listMetas(),
    storage.history.list(),
    storage.protos.list(),
    grpcurl
  );

  const webviewFactory = new WebViewFactory(context.extensionUri, grpcurl);

  vscode.commands.registerCommand("hosts.add", async () => {
    let host = (await vscode.window.showInputBox()) ?? "";
    let hosts = storage.hosts.add(host);
    treeviews.hosts.update(hosts);
  });

  vscode.commands.registerCommand("hosts.remove", async () => {
    let oldHosts = storage.hosts.list();
    let host = await vscode.window.showQuickPick(oldHosts);
    let hosts = storage.hosts.remove(host);
    treeviews.hosts.update(hosts);
  });

  vscode.commands.registerCommand("hosts.switch", async (host: string) => {
    let newHosts = storage.hosts.setCurret(host);
    treeviews.hosts.update(newHosts);
    webviewFactory.update(host);
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
    treeviews.protos.update(pathes);
  });

  vscode.commands.registerCommand("protos.remove", async () => {
    let pathes = storage.protos.list();
    let path = await vscode.window.showQuickPick(pathes);
    pathes = storage.protos.remove(path);
    treeviews.protos.update(pathes);
  });

  vscode.commands.registerCommand("protos.refresh", async () => {
    let protoPathes = storage.protos.list();
    treeviews.protos.update(protoPathes);
  });

  vscode.commands.registerCommand("metas.add", async () => {
    let meta = (await vscode.window.showInputBox()) ?? "";
    let metadata = storage.metas.add(meta);
    treeviews.metadata.refresh(metadata);
  });

  vscode.commands.registerCommand("metas.remove", async () => {
    let oldMetadata = storage.metas.list();
    let meta = await vscode.window.showQuickPick(oldMetadata);
    let metadata = storage.metas.remove(meta);
    treeviews.metadata.refresh(metadata);
  });

  vscode.commands.registerCommand("metas.switch", async (meta: string) => {
    storage.metas.switchOnOff(meta);
    let metadata = storage.metas.listMetas();
    treeviews.metadata.refresh(metadata);
  });

  vscode.commands.registerCommand("call.trigger", async (input: Request) => {
    if (input.isStream) {
      vscode.window.showWarningMessage("Stream calls are not available yet!");
      return;
    }
    const host = storage.hosts.getCurret();
    input.host = host;
    webviewFactory.create(input);
  });
}

export function deactivate() {}
