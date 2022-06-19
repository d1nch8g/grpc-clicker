import * as vscode from "vscode";
import { Adresses } from "./adresses";

export class Storage {
  public adresses: Adresses;
  constructor(context: vscode.ExtensionContext) {
    this.adresses = new Adresses(context.workspaceState);
  }
}
