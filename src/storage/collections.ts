import { Memento } from "vscode";
import { RequestData } from "../grpcurl/grpcurl";

export class Collections {
  private readonly key: string = "grpc-clicker-headers";
  constructor(private memento: Memento) {}

  save(headers: Collection[]) {
    let headerStrings: string[] = [];
    for (const header of headers) {
      headerStrings.push(JSON.stringify(header));
    }
    this.memento.update(this.key, headerStrings);
  }

  list(): Collection[] {
    let headerStrings = this.memento.get<string[]>(this.key, []);
    let headerValues: Collection[] = [];
    for (const headerString of headerStrings) {
      headerValues.push(JSON.parse(headerString));
    }
    return headerValues;
  }

  add(header: Collection) {
    let headers = this.list();
    for (const savedValue of headers) {
      if (savedValue.name === header.name) {
        return new Error(`collection you are trying to add already exists`);
      }
    }
    headers.push(header);
    this.save(headers);
    return undefined;
  }

  remove(value: string) {
    let headers = this.list();
    for (let i = 0; i < headers.length; i++) {
      if (headers[i].name === value) {
        headers.splice(i, 1);
      }
    }
    this.save(headers);
    return headers;
  }
}

export interface Collection {
  name: string;
  tests: RequestData[];
}
