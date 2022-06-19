import { Memento } from "vscode";
import { ErrStorage } from "./errors";

export class AdressesStorage {
  key: string;
  constructor(private storage: Memento) {
    this.key = "grpc-clicker-adresses";
  }

  public adressesLoad(): string[] {
    return this.storage.get<string[]>(this.key);
  }

  public adressesAdd(adress: string): ErrStorage {
    let adresses = this.storage.get<string[]>(this.key);
    if (adress.includes(adress)) {
      return ErrStorage.adressExists;
    }
    adresses.push(adress);
    this.storage.update(this.key, adresses);
  }

  public removeAdress(adress: string) {
    let adresses = this.storage.get<string[]>(this.key);
    let idx = adresses.indexOf(adress);
    if (idx !== -1) {
      adresses.splice(idx, 1);
    }
  }
}
