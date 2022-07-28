import * as vscode from "vscode";
import { Memento } from "vscode";
import { Request } from "../classes/request";

export class History {
  private readonly key: string = "grpc-clicker-history";
  constructor(private memento: Memento) {}

  private objectToRequest(input: string): Request {
    const obj = JSON.parse(input);
    const req = new Request(
      obj.path,
      obj.proto,
      obj.service,
      obj.call,
      obj.methodTag,
      obj.host,
      obj.reqName,
      obj.respName,
      obj.reqJson,
      obj.isStream,
      obj.response,
      obj.error,
      obj.date
    );
    return req;
  }

  public list(): Request[] {
    const requestStrings = this.memento.get<string[]>(this.key, []);
    const requests = [];
    for (const reqString of requestStrings) {
      requests.push(this.objectToRequest(reqString));
    }
    return requests;
  }

  public add(request: Request): Request[] {
    let requestStrings = this.memento.get<string[]>(this.key, []);
    if (requestStrings.length >= 100) {
      requestStrings.pop();
    }
    requestStrings = [JSON.stringify(request)].concat(requestStrings);
    this.memento.update(this.key, requestStrings);
    return this.list();
  }
}
