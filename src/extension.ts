import * as vscode from "vscode";
import { AdressList } from "./adress/tree";
import { LocalStorageService } from "./storage/generic";

export function activate(context: vscode.ExtensionContext) {
  // const adressStorage = new Adresses(context.globalState);
  let localstorage = new LocalStorageService(context.workspaceState);
  let adressList = new AdressList(localstorage);

  vscode.window.registerTreeDataProvider("host", adressList);

  vscode.commands.registerCommand("host.add", async () => {
    let adress = await vscode.window.showInputBox();
    let adresses = localstorage.getValue<string[]>("gadresses") ?? [];
    adresses.push(adress);
    localstorage.setValue("gadresses", adresses);
    adressList.refresh();
  });

  vscode.commands.registerCommand("host.remove", () => {});
}

export function deactivate() {}
