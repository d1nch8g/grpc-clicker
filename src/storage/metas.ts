import * as vscode from "vscode";
import { Memento } from "vscode";
import { Meta } from "../classes/meta";

export class Metadata {
  private metadataKey: string;
  constructor(private memento: Memento) {
    this.metadataKey = "grpc-clicker-metadata";
  }

  private listToMetas(metasNames: string[]): Meta[] {
    let metas: Meta[] = [];
    for (const name of metasNames) {
      metas.push(new Meta(name, this.isOn(name)));
    }
    return metas;
  }

  private isOn(meta: string): boolean {
    return this.memento.get<boolean>(`${this.metadataKey}${meta}`, false);
  }

  public switchOnOff(meta: string) {
    let isOn = this.memento.get<boolean>(`${this.metadataKey}${meta}`, false);
    isOn = !isOn;
    this.memento.update(`${this.metadataKey}${meta}`, isOn);
  }

  public listMetas(): Meta[] {
    let metas = this.memento.get<string[]>(this.metadataKey, []);
    return this.listToMetas(metas);
  }

  public list(): string[] {
    let metas = this.memento.get<string[]>(this.metadataKey, []);
    return metas;
  }

  public listActive(): string[] {
    let response = [];
    let metas = this.memento.get<string[]>(this.metadataKey, []);
    for (const meta of metas) {
      if (this.isOn(meta)) {
        response.push(meta);
      }
    }
    return response;
  }

  public add(meta: string): Meta[] {
    let metas = this.memento.get<string[]>(this.metadataKey, []);
    if (meta === "") {
      return this.listToMetas(metas);
    }
    if (!meta.includes(": ")) {
      return this.listToMetas(metas);
    }
    if (metas.includes(meta)) {
      let msg = `Meta data you are trying to add already exists!`;
      vscode.window.showErrorMessage(msg);
      return this.listToMetas(metas);
    }
    metas.push(meta);
    this.memento.update(this.metadataKey, metas);
    return this.listToMetas(metas);
  }

  public remove(meta: string): Meta[] {
    let metas = this.memento.get<string[]>(this.metadataKey, []);
    let idx = metas.indexOf(meta);
    if (idx !== -1) {
      metas.splice(idx, 1);
    }
    this.memento.update(this.metadataKey, metas);
    return this.listToMetas(metas);
  }
}
