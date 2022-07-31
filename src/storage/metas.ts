import { Memento } from "vscode";

export class Headers {
  private readonly key: string = "grpc-clicker-headers";
  constructor(private memento: Memento) {}

  private saveHeaders(headers: Headers[]) {
    let headerStrings: string[] = [];
    for (const header of headers) {
      headerStrings.push(JSON.stringify(header));
    }
    this.memento.update(this.key, headerStrings);
  }

  list(): Headers[] {
    let headerStrings = this.memento.get<string[]>(this.key, []);
    let headerValues: Headers[] = [];
    for (const headerString of headerStrings) {
      headerValues.push(JSON.parse(headerString));
    }
    return headerValues;
  }

  add(header: Headers) {
    let headers = this.list();
    for (const savedValue of headers) {
      if (savedValue.value === header.value) {
        return new Error(`metdata value you are trying to add already exists`);
      }
    }
    headers.push(header);
    this.saveHeaders(headers);
  }

  remove(value: string) {
    let headers = this.list();
    for (let i = 0; i < headers.length; i++) {
      if (headers[i].value === value) {
        headers.splice(i, 1);
      }
    }
    return headers;
  }
}

export interface Headers {
  value: string;
  active: boolean;
}
