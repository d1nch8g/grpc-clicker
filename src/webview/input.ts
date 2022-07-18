export class PanelInput {
  constructor(
    public proto: string,
    public adress: string,
    public tls: boolean,
    public json: string,
    public stream: boolean,
    public message: string
  ) {
    this.message = `${proto}|${adress}|${tls}|${json}|${stream}|${message}`;
  }
}
