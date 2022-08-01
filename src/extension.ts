import * as vscode from "vscode";
import { Caller } from "./grpcurl/caller";
import { Grpcurl } from "./grpcurl/grpcurl";
import { Parser } from "./grpcurl/parser";
import { Storage } from "./storage/storage";
import { TreeViews } from "./treeviews/treeviews";
import { WebViewFactory } from "./webview";

export function activate(context: vscode.ExtensionContext) {
  const storage = new Storage(context.globalState);
  const grpcurl = new Grpcurl(new Parser(), new Caller());
  const treeviews = new TreeViews(
    storage.hosts.list(),
    storage.headers.list(),
    storage.history.list(),
    storage.protos.list()
  );

  const webviewFactory = new WebViewFactory(
    context.extensionUri,
    async (request: Request): Promise<Request> => {
      const dateTime = new Date();
      let [resp, error] = await grpcurl.send(
        request.path,
        request.reqJson,
        request.host,
        request.methodTag,
        false
      );
      request.response = resp;
      request.error = error;
      request.date = dateTime.toUTCString();
      const requests = storage.history.add(request);
      treeviews.history.update(requests);
      return request;
    }
  );

  vscode.commands.registerCommand("hosts.add", async () => {
    let host = (await vscode.window.showInputBox()) ?? "";
    let [hosts, err] = storage.hosts.add(host);
    if (err !== null) {
      vscode.window.showErrorMessage(err.message);
    }
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
    let [pathes, err] = storage.protos.add(path);
    if (err !== null) {
      vscode.window.showErrorMessage(err.message);
    }
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

  vscode.commands.registerCommand("headres.add", async () => {
    let meta = (await vscode.window.showInputBox()) ?? "";
    let [metadata, err] = storage.headres.add(meta);
    if (err !== null) {
      vscode.window.showErrorMessage(err.message);
    }
    treeviews.metadata.refresh(metadata);
  });

  vscode.commands.registerCommand("headres.remove", async () => {
    let oldMetadata = storage.headres.list();
    let meta = await vscode.window.showQuickPick(oldMetadata);
    let metadata = storage.headres.remove(meta);
    treeviews.metadata.refresh(metadata);
  });

  vscode.commands.registerCommand("headres.switch", async (meta: string) => {
    storage.headres.switchOnOff(meta);
    let metadata = storage.headres.listMetas();
    treeviews.metadata.refresh(metadata);
  });

  vscode.commands.registerCommand("webview.open", async (input: Request) => {
    if (input.isStream) {
      vscode.window.showWarningMessage("Stream calls are not available yet!");
      return;
    }
    const host = storage.hosts.getCurret();
    input.host = host;
    const hosts = storage.hosts.list();
    input.hosts = hosts;
    webviewFactory.create(input);
  });
}

export function deactivate() {}
