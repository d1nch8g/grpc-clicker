import { Call } from "./call";
import { Message } from "./message";

export class Service {
  public name: string;
  public fullName: string;
  public calls: Call[];
  constructor(private lines: string[]) {
    console.log(lines);
  }
}
