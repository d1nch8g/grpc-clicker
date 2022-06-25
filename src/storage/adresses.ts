import * as vscode from "vscode";
import { Memento } from "vscode";

export class Adresses {
  private adressesKey: string;
  private currentAdressKey: string;
  constructor(private memento: Memento) {
    this.adressesKey = "grpc-clicker-adresses";
    this.currentAdressKey = "grpc-clicker-curAdress";
  }

  public list(): string[] {
    let adresses = this.memento.get<string[]>(this.adressesKey, []);
    return adresses;
  }

  public add(adress: string) {
    let adresses = this.memento.get<string[]>(this.adressesKey, []);
    if (adresses.includes(adress)) {
      let msg = `Adress you are trying to add already exists!`;
      vscode.window.showErrorMessage(msg);
      return;
    }
    adresses.push(adress);
    this.memento.update(this.adressesKey, adresses);
    return;
  }

  public remove(adress: string) {
    let adresses = this.memento.get<string[]>(this.adressesKey, []);
    let idx = adresses.indexOf(adress);
    if (idx !== -1) {
      adresses.splice(idx, 1);
    }
    this.memento.update(this.adressesKey, adresses);
  }

  public getCurret(): string {
    return this.memento.get<string>(this.currentAdressKey, ``);
  }

  public setCurret(adress: string) {
    this.memento.update(this.currentAdressKey, adress);
  }
}
