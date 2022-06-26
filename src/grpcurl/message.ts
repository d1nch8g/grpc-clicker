export class Message {
  public name: string;
  public tag: string;
  constructor(rawmessage: string, private path: string) {
    let splitted = rawmessage.split(" ");
    this.tag = splitted[splitted.length - 2];
    let splittedtag = this.tag.split(".");
    this.name = splittedtag[splittedtag.length - 1];
  }
  async fields() {}
}
