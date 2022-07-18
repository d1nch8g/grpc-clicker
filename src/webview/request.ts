export class PanelRequest {
  public message: string;
  constructor(output: string) {
    this.message = output;
  }

  toString(): string {
    return `🐛 ola es me`;
  }
}
