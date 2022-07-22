import { Message } from "./message";
import { Proto } from "./proto";

export class Call {
  public input: Message;
  public inputIsStream: boolean = false;
  public output: Message;
  public outputIsStream: boolean = false;
  public name: string;
  public tag: string;
  public service: string;
  constructor(line: string, svc: string, public proto: Proto) {
    let splittedspace = line.split(" ");
    this.name = splittedspace[3];
    let splittedquote = line.split(")");
    this.input = new Message(splittedquote[0], proto.path);
    this.output = new Message(splittedquote[1], proto.path);
    if (splittedquote[0].includes("stream")) {
      this.inputIsStream = true;
    }
    if (splittedquote[1].includes("stream")) {
      this.outputIsStream = true;
    }
    this.tag = `${svc}.${this.name}`;
    let splitted = svc.split(`.`);
    this.service = splitted[splitted.length - 1];
  }
}
