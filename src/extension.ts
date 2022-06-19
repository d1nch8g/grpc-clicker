import * as vscode from "vscode";
import { AdressList } from "./adress/list";
import { ErrStorage } from "./storage/errors";
import { Storage } from "./storage/storage";

export function activate(context: vscode.ExtensionContext) {
  const storage = new Storage(context.globalState);
  const hosts = new AdressList(storage.adressses);
  vscode.window.registerTreeDataProvider("host", hosts);

  vscode.commands.registerCommand("host.add", async () => {
    let adress = (await vscode.window.showInputBox()) ?? "";
    if (adress === "") {
      return;
    }
    let error = storage.adressses.add(adress);
    if (error === ErrStorage.adressExists) {
      let msg = `Adress you are trying to add already exists!`;
      vscode.window.showErrorMessage(msg);
      return;
    }
    hosts.refresh();
  });

  vscode.commands.registerCommand("host.remove", async () => {
    let adresses = storage.adressses.list();
    let adress = await vscode.window.showQuickPick(adresses);
    storage.adressses.remove(adress);
    hosts.refresh();
  });
}

export function deactivate() {}
