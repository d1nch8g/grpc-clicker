import * as vscode from "vscode";
import { AdressList } from "./adress/list";
import { Adresses } from "./storage/adresses";
import { ErrStorage } from "./storage/errors";

export function activate(context: vscode.ExtensionContext) {
  const adressStorage = new Adresses(context.globalState);
  const adressList = new AdressList(adressStorage);

  vscode.window.registerTreeDataProvider("host", adressList);

  vscode.commands.registerCommand("host.add", async () => {
    let adress = (await vscode.window.showInputBox()) ?? "";
    if (adress === "") {
      return;
    }
    let error = adressStorage.add(adress);
    if (error === ErrStorage.adressExists) {
      let msg = `Adress you are trying to add already exists!`;
      vscode.window.showErrorMessage(msg);
      return;
    }
    let msg = `Adress have been added: ${adress}!`;
    vscode.window.showInformationMessage(msg);
    adressList.refresh();
  });

  vscode.commands.registerCommand("host.remove", async () => {
    let adresses = adressStorage.list();
    let adress = await vscode.window.showQuickPick(adresses, {
      canPickMany: false,
    });
    adressStorage.remove(adress);
    let msg = `Adress have been removed: ${adress}!`;
    vscode.window.showInformationMessage(msg);
    adressList.refresh();
  });
}

export function deactivate() {}
