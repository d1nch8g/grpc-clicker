import { Memento } from "vscode";

export enum StorageError {
  nil,
  adressExists,
}

export class Storage {
  constructor(private storage: Memento) {}

  public loadAdresses(): string[] {
    return this.storage.get<string[]>("grpc-clicker-adresses");
  }

  public addAdress(adress: string): StorageError {
    let adresses = this.storage.get<string[]>("grpc-clicker-adresses");
    if (adress.includes(adress)) {
      return StorageError.adressExists;
    }
    
  }
}
