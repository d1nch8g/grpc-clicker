import * as vscode from "vscode";
import { AdressList } from "./adress/tree";

export function activate(context: vscode.ExtensionContext) {
  const adressList = new AdressList();

  vscode.window.registerTreeDataProvider("host", adressList);

  vscode.commands.registerCommand("host.add", () => {});

  vscode.commands.registerCommand("host.remove", () => {});
}

export function deactivate() {}
