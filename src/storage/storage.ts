import { Memento } from "vscode";

export enum ErrStorage {
  nil,
  adressExists,
}

export class Storage {
  storageAdresses: string;
  constructor(private storage: Memento) {
    this.storageAdresses = "grpc-clicker-adresses";
  }

  public loadAdresses(): string[] {
    return this.storage.get<string[]>(this.storageAdresses);
  }

  public addAdress(adress: string): ErrStorage {
    let adresses = this.storage.get<string[]>(this.storageAdresses);
    if (adress.includes(adress)) {
      return ErrStorage.adressExists;
    }
    adresses.push(adress);
    this.storage.update(this.storageAdresses, adresses);
  }
}
