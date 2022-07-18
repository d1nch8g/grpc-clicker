export class PanelMessage {
  public response: string;
  public time: string;
  public code: string;
  constructor(
    public proto: string,
    public adress: string,
    public tls: boolean,
    public json: string,
    public stream: boolean
  ) {
    this.response = `${proto}|${adress}|${tls}|${json}|${stream}`;
  }

  toString(): string {
    return `🐛 ola es me`;
  }
}
