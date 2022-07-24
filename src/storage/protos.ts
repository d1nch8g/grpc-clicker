import * as vscode from "vscode";
import { Memento } from "vscode";

export class Protos {
  private readonly key: string = "grpc-clicker-structures";
  constructor(private memento: Memento) {}

  public list(): string[] {
    let pathes = this.memento.get<string[]>(this.key, []);
    return pathes;
  }

  public add(path: string): string[] {
    let pathes = this.memento.get<string[]>(this.key, []);
    if (path === "") {
      return pathes;
    }
    if (pathes.includes(path)) {
      let msg = `Proto you are trying to add already exists!`;
      vscode.window.showErrorMessage(msg);
      return pathes;
    }
    pathes.push(path);
    this.memento.update(this.key, pathes);
    return pathes;
  }

  public remove(adress: string): string[] {
    let adresses = this.memento.get<string[]>(this.key, []);
    let idx = adresses.indexOf(adress);
    if (idx !== -1) {
      adresses.splice(idx, 1);
    }
    this.memento.update(this.key, adresses);
    return adresses;
  }
}
