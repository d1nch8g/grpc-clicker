export class PanelInput {
  public message: string;
  constructor(
    public proto: string,
    public adress: string,
    public tls: boolean,
    public json: string,
    public stream: boolean
  ) {
    this.message = `${proto}|${adress}|${tls}|${json}|${stream}`;
  }
}
