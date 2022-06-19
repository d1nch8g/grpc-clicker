import { Memento } from "vscode";
import { ErrStorage } from "./errors";

export class Adresses {
  adressesKey: string;
  currentAdressKey: string;
  constructor(private memento: Memento) {
    this.adressesKey = "grpc-clicker-adresses";
    this.currentAdressKey = "grpc-clicker-curAdress";
  }

  public list(): string[] {
    let adresses = this.memento.get<string[]>(this.adressesKey, []);
    return adresses;
  }

  public add(adress: string): ErrStorage {
    let adresses = this.memento.get<string[]>(this.adressesKey, []);
    if (adresses.includes(adress)) {
      return ErrStorage.adressExists;
    }
    adresses.push(adress);
    this.memento.update(this.adressesKey, adresses);
    return ErrStorage.nil;
  }

  public remove(adress: string) {
    let adresses = this.memento.get<string[]>(this.adressesKey, []);
    let idx = adresses.indexOf(adress);
    if (idx !== -1) {
      adresses.splice(idx, 1);
    }
  }

  public getCurret(): string {
    return this.memento.get<string>(this.currentAdressKey) ?? ``;
  }

  public setCurret(adress: string) {
    this.memento.update(this.currentAdressKey, adress);
  }
}
