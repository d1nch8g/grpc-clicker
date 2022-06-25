import { Memento } from "vscode";
import { Adresses } from "./adresses";
import { Structures as Protos } from "./structures";

export class Storage {
  public adressses: Adresses;
  public protos: Protos;
  constructor(memento: Memento) {
    this.adressses = new Adresses(memento);
    this.protos = new Protos(memento);
  }
}
