export class Input {
  constructor(
    public proto: string,
    public version: string,
    public requestName: string,
    public requestRepresentation: string,
    public responseName: string,
    public responseRepresentation: string,
    public adress: string,
    public callName: string,
    public call: string,
    public stream: boolean,
    public meta: string[]
  ) {}
}
