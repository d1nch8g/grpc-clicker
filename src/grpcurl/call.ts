import { Message } from "./message";

export class Call {
  public input: Message;
  public output: Message;
  public name: string;
  constructor(line: string) {
    let splittedspace = line.split(" ");
    let splittedquote = line.split(")");
    this.name = splittedspace[3];
    this.input = new Message(splittedquote[0]);
    this.output = new Message(splittedquote[1]);
  }
}
