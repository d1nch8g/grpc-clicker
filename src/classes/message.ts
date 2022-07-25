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
    if (this.fields.length === 0) {
      return `{}`;
    }
    let representation = `{\n`;
    for (const field of this.fields) {
      representation += `    "${field.field}": "${field.type}",\n`;
    }
    representation = representation.substring(0, representation.length - 3);
    representation += `"\n}`;
    return representation;
  }
}
