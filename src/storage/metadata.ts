import * as vscode from "vscode";
import { Memento } from "vscode";

export class Metadata {
  private metadataKey: string;
  constructor(private memento: Memento) {
    this.metadataKey = "grpc-clicker-metadata";
  }

  public list(): string[] {
    let metas = this.memento.get<string[]>(this.metadataKey, []);
    return metas;
  }

  public add(meta: string): string[] {
    let metas = this.memento.get<string[]>(this.metadataKey, []);
    if (meta === "") {
      return metas;
    }
    if (!meta.includes(": ")) {
      return metas;
    }
    if (metas.includes(meta)) {
      let msg = `Meta data you are trying to add already exists!`;
      vscode.window.showErrorMessage(msg);
      return metas;
    }
    metas.push(meta);
    this.memento.update(this.metadataKey, metas);
    return metas;
  }

  public remove(meta: string): string[] {
    let metas = this.memento.get<string[]>(this.metadataKey, []);
    let idx = metas.indexOf(meta);
    if (idx !== -1) {
      metas.splice(idx, 1);
    }
    this.memento.update(this.metadataKey, metas);
    return metas;
  }
}
