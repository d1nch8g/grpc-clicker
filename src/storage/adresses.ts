import { Memento } from "vscode";
import { ErrStorage } from "./errors";

export class Adresses {
  adressesKey: string;
  currentAdressKey: string;
  constructor(private storage: Memento) {
    this.adressesKey = "grpc-clicker-adresses";
    this.currentAdressKey = "grpc-clicker-curAdress";
  }

  public list(): string[] {
    return this.storage.get<string[]>(this.adressesKey);
  }

  public add(adress: string): ErrStorage {
    let adresses = this.storage.get<string[]>(this.adressesKey);
    if (adress.includes(adress)) {
      return ErrStorage.adressExists;
    }
    adresses.push(adress);
    this.storage.update(this.adressesKey, adresses);
  }

  public remove(adress: string) {
    let adresses = this.storage.get<string[]>(this.adressesKey);
    let idx = adresses.indexOf(adress);
    if (idx !== -1) {
      adresses.splice(idx, 1);
    }
  }

  public getCurret(): string {
    return this.storage.get<string>(this.currentAdressKey);
  }

  public setCurret(adress: string) {
    this.storage.update(this.currentAdressKey, adress);
  }
}
