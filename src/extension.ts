import * as vscode from "vscode";
import { AdressList } from "./adress/tree";
import { Adresses } from "./storage/adresses";

export function activate(context: vscode.ExtensionContext) {
  const adressStorage = new Adresses(context.globalState);
  const adressList = new AdressList(adressStorage);

  vscode.window.registerTreeDataProvider("host", adressList);

  vscode.commands.registerCommand("host.add", async () => {
    let adress = await vscode.window.showInputBox();
    adressStorage.add(adress);
    let msg = `Adress for calls: ${adress} have been added`;
    vscode.window.showInformationMessage(msg);
    adressList.refresh();
  });

  vscode.commands.registerCommand("host.remove", () => {});
}

export function deactivate() {}
