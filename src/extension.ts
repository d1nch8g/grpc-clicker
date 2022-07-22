import * as vscode from "vscode";
import { Grpcurl } from "./grpcurl/grpcurl";
import { AdressList as HostsTreeView } from "./hosts/list";
import { MetasList } from "./metas/list";
import { ProtosTree as ProtosTreeView } from "./protos/tree";
import { Storage } from "./storage/storage";
import { Input } from "./webview/input";
import { GrpcClickerView } from "./webview/panel";

export async function activate(context: vscode.ExtensionContext) {
  const grpcurl = new Grpcurl();
  const storage = new Storage(context.globalState);

  const hostsView = new HostsTreeView(storage.hosts.listAsHosts());

  const protos = await grpcurl.protos(storage.protos.list());
  const protosView = new ProtosTreeView(grpcurl, protos);

  const metasList = new MetasList(storage.metas.listMetas());

  const webview = new GrpcClickerView(context.extensionUri);

  vscode.window.registerTreeDataProvider("hosts", hostsView);
  vscode.window.registerTreeDataProvider("protos", protosView);
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

  vscode.commands.registerCommand("call.trigger", async (input: Input) => {
    // if (input.stream) {
    //   vscode.window.showWarningMessage("Stream calls are not available yet!");
    //   return;
    // }
    webview.create(input);
  });
}

export function deactivate() {}
