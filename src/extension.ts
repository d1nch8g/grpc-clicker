import * as vscode from "vscode";
import { AdressList as HostsTreeView } from "./hosts/list";
import { getProto } from "./grpcurl/proto";
import { Storage } from "./storage/storage";

export function activate(context: vscode.ExtensionContext) {
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

  vscode.commands.registerCommand("schema.add", async () => {
    let path = (await vscode.window.showInputBox()) ?? "";
    if (path === "") {
      return;
    }
    var struc = await getProto(path);
    storage.protos.add(struc);
  });

  vscode.commands.registerCommand("schema.remove", async () => {});

  vscode.commands.registerCommand("schema.refresh", async () => {});
}

export function deactivate() {}
