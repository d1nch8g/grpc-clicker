import { Memento } from "vscode";
import { Meta } from "../classes/meta";

export class Metadata {
  private readonly key: string = "grpc-clicker-metadata";
  constructor(private memento: Memento) {}

  private listToMetas(metasNames: string[]): Meta[] {
    let metas: Meta[] = [];
    for (const name of metasNames) {
      metas.push(new Meta(name, this.isOn(name)));
    }
    return metas;
  }

  private isOn(meta: string): boolean {
    return this.memento.get<boolean>(`${this.key}${meta}`, false);
  }

  public switchOnOff(meta: string) {
    let isOn = this.memento.get<boolean>(`${this.key}${meta}`, false);
    isOn = !isOn;
    this.memento.update(`${this.key}${meta}`, isOn);
  }

  public listMetas(): Meta[] {
    let metas = this.memento.get<string[]>(this.key, []);
    return this.listToMetas(metas);
  }

  public list(): string[] {
    let metas = this.memento.get<string[]>(this.key, []);
    return metas;
  }

  public listActive(): string[] {
    let response = [];
    let metas = this.memento.get<string[]>(this.key, []);
    for (const meta of metas) {
      if (this.isOn(meta)) {
        response.push(meta);
      }
    }
    return response;
  }

  public add(meta: string): [Meta[], Error] {
    let metas = this.memento.get<string[]>(this.key, []);
    if (meta === "") {
      return [this.listToMetas(metas), null];
    }
    if (!meta.includes(": ")) {
      return [this.listToMetas(metas), null];
    }
    if (metas.includes(meta)) {
      let msg = `Meta data you are trying to add already exists!`;
      return [this.listToMetas(metas), new Error(msg)];
    }
    metas.push(meta);
    this.memento.update(this.key, metas);
    return [this.listToMetas(metas), null];
  }

  public remove(meta: string): Meta[] {
    let metas = this.memento.get<string[]>(this.key, []);
    let idx = metas.indexOf(meta);
    if (idx !== -1) {
      metas.splice(idx, 1);
    }
    this.memento.update(this.key, metas);
    return this.listToMetas(metas);
  }
}
