import { Memento } from "vscode";
import { FileSource, ServerSource } from "../grpcurl/caller";
import { Request, Response } from "../grpcurl/grpcurl";
import { History, HistoryValue } from "./history";

class MockMemento implements Memento {
  values: string[] = [];

  keys(): readonly string[] {
    throw new Error("Method not implemented.");
  }
  get<T>(key: string): T;
  get<T>(key: string, defaultValue: T): T;
  get(key: unknown, defaultValue?: unknown): any {
    return this.values;
  }
  update(key: string, value: any): Thenable<void> {
    return (this.values = value);
  }
}

const serverSource: ServerSource = {
  type: "SERVER",
  host: "",
  usePlaintext: false,
};

const fileSource: FileSource = {
  type: "FILE",
  filePath: "",
  importPath: "",
};

const request: Request = {
  file: fileSource,
  json: "",
  server: serverSource,
  callTag: "",
  maxMsgSize: 0,
  headers: [],
};

const response: Response = {
  date: "",
  time: 0,
  code: "OK",
  content: "",
};

const value: HistoryValue = {
  request: request,
  response: response,
};

test(`add`, () => {
  const storage = new MockMemento();
  const history = new History(storage);
  for (let i = 0; i < 200; i++) {
    history.add(value);
  }
  expect(storage.values.length).toBe(100);
});

test(`list`, () => {
  const storage = new MockMemento();
  const history = new History(storage);

  history.add(value);

  let resp = history.list();

  expect(resp).toStrictEqual([value]);
});

test(`clean`, () => {
  const storage = new MockMemento();
  const history = new History(storage);

  history.add(value);

  history.clean();
  expect(storage.values).toBeUndefined();
});
