import * as vscode from "vscode";
import { AdressList } from "./adress/tree";
import { Storage } from "./storage/storage";

export function activate(context: vscode.ExtensionContext) {
  const storage = new Storage(context);
  const adressList = new AdressList(storage);

  vscode.window.registerTreeDataProvider("host", adressList);

  vscode.commands.registerCommand("host.add", () => {});

  vscode.commands.registerCommand("host.remove", () => {});
}

export function deactivate() {}
