import * as vscode from "vscode";
import { Grpcurl } from "./grpcurl/grpcurl";
import { AdressList as HostsTreeView } from "./hosts/list";
import { Storage } from "./storage/storage";

export function activate(context: vscode.ExtensionContext) {
  const grpcurl = new Grpcurl();
  const storage = new Storage(context.globalState);

  const hosts = new HostsTreeView(storage.adressses);

  vscode.window.registerTreeDataProvider("host", hosts);

  vscode.commands.registerCommand("host.add", async () => {
    let adress = (await vscode.window.showInputBox()) ?? "";
    if (adress === "") {
      return;
    }
    storage.adressses.add(adress);
    hosts.refresh();
  });

  vscode.commands.registerCommand("host.remove", async () => {
    let adresses = storage.adressses.list();
    let adress = await vscode.window.showQuickPick(adresses);
    storage.adressses.remove(adress);
    hosts.refresh();
  });

  vscode.commands.registerCommand("host.switch", async (host: string) => {
    storage.adressses.setCurret(host);
    let msg = `Host for gRPC calls being switched: ${host}`;
    vscode.window.showInformationMessage(msg);
  });

  vscode.commands.registerCommand("schema.add", async () => {
    let path = (await vscode.window.showInputBox()) ?? "";
    if (path === "") {
      return;
    }
    var struc = await grpcurl.proto(path);
    storage.protos.add(struc);
    // TODO add protos view refresh
  });

  vscode.commands.registerCommand("schema.remove", async () => {
    let protoPathes = storage.protos.pathes();
    let path = await vscode.window.showQuickPick(protoPathes);
    storage.protos.remove(path);
    // TODO add protos view refresh
  });

  vscode.commands.registerCommand("schema.refresh", async () => {});
}

export function deactivate() {}
