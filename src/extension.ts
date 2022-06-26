import * as vscode from "vscode";
import { Grpcurl } from "./grpcurl/grpcurl";
import { AdressList as HostsTreeView } from "./hosts/list";
import { ProtosTree as ProtosTreeView } from "./protos/tree";
import { Storage } from "./storage/storage";

export async function activate(context: vscode.ExtensionContext) {
  const grpcurl = new Grpcurl();
  const storage = new Storage(context.globalState);

  const hostsView = new HostsTreeView(storage.adresses.list());
  vscode.window.registerTreeDataProvider("hosts", hostsView);

  const protos = new ProtosTreeView(
    await grpcurl.protos(storage.protos.list())
  );
  vscode.window.registerTreeDataProvider("protos", protos);

  vscode.commands.registerCommand("hosts.add", async () => {
    let host = (await vscode.window.showInputBox()) ?? "";
    let hosts = storage.adresses.add(host);
    hostsView.refresh(hosts);
  });

  vscode.commands.registerCommand("hosts.remove", async () => {
    let adresses = storage.adresses.list();
    let adress = await vscode.window.showQuickPick(adresses);
    storage.adresses.remove(adress);
    hostsView.refresh();
  });

  vscode.commands.registerCommand("hosts.switch", async (host: string) => {
    storage.adresses.setCurret(host);
    let msg = `Host for gRPC calls being switched: ${host}`;
    vscode.window.showInformationMessage(msg);
  });

  vscode.commands.registerCommand("protos.add", async () => {
    let path = (await vscode.window.showInputBox()) ?? "";
    storage.protos.add(path);
    var struc = await grpcurl.proto(path);
    protos.refresh();
  });

  vscode.commands.registerCommand("protos.remove", async () => {
    let protoPathes = storage.protos.pathes();
    let path = await vscode.window.showQuickPick(protoPathes);
    storage.protos.remove(path);
    protos.refresh();
  });

  vscode.commands.registerCommand("protos.refresh", async () => {
    protos.refresh();
  });
}

export function deactivate() {}
