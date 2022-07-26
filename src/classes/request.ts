export class Request {
  constructor(
    public path: string,
    public proto: string,
    public version: string,
    public service: string,
    public call: string,
    public methodTag: string,
    public host: string,
    public reqName: string,
    public respName: string,
    public reqJson: string,
    public isStream: boolean,
    public response: string,
    public error: string,
    public date: string
  ) {}
}
