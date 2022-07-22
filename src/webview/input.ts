export class Input {
  constructor(
    public proto: string,
    public version: string,
    public service: string,
    public call: string,
    public adress: string,
    public reqName: string,
    public respName: string,
    public reqJson: string,
    public isStream: boolean
  ) {}
}
