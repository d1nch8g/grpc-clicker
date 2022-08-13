import { Memento } from "vscode";
import { RequestData } from "../grpcurl/grpcurl";

export class History {
  private readonly key: string = "grpc-clicker-history";
  constructor(private memento: Memento) {}

  public list(): RequestData[] {
    const requestStrings = this.memento.get<string[]>(this.key, []);
    const requests = [];
    for (const reqString of requestStrings) {
      requests.push(JSON.parse(reqString));
    }
    return requests;
  }

  public add(request: RequestData): RequestData[] {
    let requestStrings = this.memento.get<string[]>(this.key, []);
    if (requestStrings.length >= 100) {
      requestStrings.pop();
    }
    requestStrings = [JSON.stringify(request)].concat(requestStrings);
    this.memento.update(this.key, requestStrings);
    return this.list();
  }

  public clean() {
    this.memento.update(this.key, undefined);
  }
}
