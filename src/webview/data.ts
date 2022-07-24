export class Input {
  public type = "init";
  constructor(
    public path: string,
    public proto: string,
    public version: string,
    public service: string,
    public call: string,
    public methodTag: string,
    public adress: string,
    public reqName: string,
    public respName: string,
    public reqJson: string,
    public isStream: boolean
  ) {}

  toJsonString(): string {
    return JSON.stringify(this);
  }
}

export class Response {
  public type = "response";
  constructor(public output: string) {}

  toJsonString(): string {
    return JSON.stringify(this);
  }
}

export class NewMetadata {
  public type = "adress";
  constructor(public adress: string) {}

  toJsonString(): string {
    return JSON.stringify(this);
  }
}
