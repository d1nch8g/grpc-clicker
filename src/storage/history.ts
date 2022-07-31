import { Memento } from "vscode";
import { Request, Response } from "../grpcurl/grpcurl";

export class History {
  private readonly key: string = "grpc-clicker-history";
  constructor(private memento: Memento) {}

  public list(): RequestHistoryData[] {
    const requestStrings = this.memento.get<string[]>(this.key, []);
    const requests = [];
    for (const reqString of requestStrings) {
      requests.push(JSON.parse(reqString));
    }
    return requests;
  }

  public add(request: RequestHistoryData): RequestHistoryData[] {
    let requestStrings = this.memento.get<string[]>(this.key, []);
    if (requestStrings.length >= 100) {
      requestStrings.pop();
    }
    requestStrings = [JSON.stringify(request)].concat(requestStrings);
    this.memento.update(this.key, requestStrings);
    return this.list();
  }
}

export interface RequestHistoryData extends Request, Response {
  fileName: string;
  protoName: string;
}
