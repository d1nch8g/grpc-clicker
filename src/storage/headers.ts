import { Memento } from "vscode";

export class Headers {
  private readonly key: string = "grpc-clicker-headers";
  constructor(private memento: Memento) {}

  save(headers: Header[]) {
    let headerStrings: string[] = [];
    for (const header of headers) {
      headerStrings.push(JSON.stringify(header));
    }
    this.memento.update(this.key, headerStrings);
  }

  list(): Header[] {
    let headerStrings = this.memento.get<string[]>(this.key, []);
    let headerValues: Header[] = [];
    for (const headerString of headerStrings) {
      headerValues.push(JSON.parse(headerString));
    }
    return headerValues;
  }

  add(header: Header) {
    let headers = this.list();
    for (const savedValue of headers) {
      if (savedValue.value === header.value) {
        return new Error(`header you are trying to add already exists`);
      }
    }
    headers.push(header);
    this.save(headers);
    return undefined;
  }

  remove(value: string) {
    let headers = this.list();
    for (let i = 0; i < headers.length; i++) {
      if (headers[i].value === value) {
        headers.splice(i, 1);
      }
    }
    this.save(headers);
    return headers;
  }
}

export interface Header {
  value: string;
  active: boolean;
}
