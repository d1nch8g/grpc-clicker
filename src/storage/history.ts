import { Memento } from "vscode";
import { Request, Response } from "../grpcurl/grpcurl";

/**
 * History data for request, allowing to restore webview from saved history
 */
export interface HistoryValue {
  /**
   * Request relevant data
   */
  request: Request;
  /**
   * Response relevant data
   */
  response: Response;
}

export class History {
  private readonly key: string = "grpc-clicker-history";
  constructor(private memento: Memento) {}

  public list(): HistoryValue[] {
    const requestStrings = this.memento.get<string[]>(this.key, []);
    const requests = [];
    for (const reqString of requestStrings) {
      requests.push(JSON.parse(reqString));
    }
    return requests;
  }

  public add(request: HistoryValue) {
    let requestStrings = this.memento.get<string[]>(this.key, []);
    if (requestStrings.length >= 100) {
      requestStrings.pop();
    }
    requestStrings = [JSON.stringify(request)].concat(requestStrings);
    this.memento.update(this.key, requestStrings);
  }

  public clean() {
    this.memento.update(this.key, undefined);
  }
}
