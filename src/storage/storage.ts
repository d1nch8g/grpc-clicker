import { Memento } from "vscode";
import { Adresses } from "./adresses";

export class Storage {
  public adressses: Adresses;
  constructor(private memento: Memento) {
    this.adressses = new Adresses(memento);
  }
}
