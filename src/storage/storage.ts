import { Memento } from "vscode";
import { Adresses } from "./adresses";
import { Structures } from "./structures";

export class Storage {
  public adressses: Adresses;
  public structures: Structures;
  constructor(memento: Memento) {
    this.adressses = new Adresses(memento);
    this.structures = new Structures(memento);
  }
}
