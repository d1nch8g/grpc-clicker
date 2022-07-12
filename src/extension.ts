import * as vscode from "vscode";
import { Grpcurl } from "./grpcurl/grpcurl";
import { AdressList as HostsTreeView } from "./hosts/list";
import { MetasList } from "./metas/list";
import { ProtosTree as ProtosTreeView } from "./protos/tree";
import { Storage } from "./storage/storage";

export async function activate(context: vscode.ExtensionContext) {
  const grpcurl = new Grpcurl();
  const storage = new Storage(context.globalState);

  const hostsView = new HostsTreeView(storage.hosts.list());
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

  vscode.commands.registerCommand("call.trigger", async () => {
    vscode.window.showInformationMessage(`call triggered`);
    let metas = storage.metas.listMetas();
    metasList.refresh(metas);
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
}

export function deactivate() {}
