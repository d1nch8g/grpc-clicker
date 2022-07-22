import { Field } from "./field";

export class Message {
  public name: string;
  public tag: string;
  public fields: Field[] = [];
  constructor(rawmessage: string, public path: string) {
    let splitted = rawmessage.split(" ");
    this.tag = splitted[splitted.length - 2];
    let splittedtag = this.tag.split(".");
    this.name = splittedtag[splittedtag.length - 1];
  }
  representation(): string {
    let representation = "";
    for (const field of this.fields) {
      representation += `${field.type}|${field.name}\n`;
    }
    return representation;
  }
}
