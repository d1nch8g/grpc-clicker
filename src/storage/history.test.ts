import { Memento } from "vscode";
import { ProtoSource } from "../grpcurl/caller";
import { Request, Response } from "../grpcurl/grpcurl";
import { AdditionalInfo, History, HistoryValue } from "./history";

class MockMemento implements Memento {
  values: string[] = [];

  keys(): readonly string[] {
    throw new Error("Method not implemented.");
  }
  get<T>(key: string): T;
  get<T>(key: string, defaultValue: T): T;
  get(key: unknown, defaultValue?: unknown): any {
    if (key === `grpc-clicker-history-count`) {
      return;
    }
    return this.values;
  }
  async update(key: string, value: any): Promise<void> {
    if (key === `grpc-clicker-history-count`) {
      return undefined;
    }
    return (this.values = value);
  }
}

const serverSource: ProtoSource = {
  uuid: "",
  currentHost: "",
  additionalHosts: [],
  plaintext: false,
  timeout: 0,
  filePath: `value`,
  group: `value`,
  importPaths: []
};


const request: Request = {
  content: "",
  source: serverSource,
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

const info: AdditionalInfo = {
  service: "",
  call: "",
  inputMessageTag: "",
  inputMessageName: "",
  outputMessageName: "",
  protoPackage: "",
};

const value: HistoryValue = {
  request: request,
  response: response,
  info: info,
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
