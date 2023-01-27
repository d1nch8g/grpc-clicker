import { Memento } from "vscode";

/**
 * Single header that can be used to
 */
export interface Header {
  /**
   * Actual header value in `grpcurl` compatible format:
   * - Example: `username: user`
   * - Example: `password: pass`
   */
  value: string;
  /**
   * Wether header is active and should be sent with request
   */
  active: boolean;
}

export class Headers {
  constructor(private memento: Memento) {}

  save(headers: Header[]) {
    this.memento.update(`headers`, headers);
  }

  list(): Header[] {
    return this.memento.get(`headers`, []);
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
