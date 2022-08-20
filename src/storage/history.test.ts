import { Memento } from "vscode";
import { ServerSource } from "../grpcurl/caller";
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

test(`add`, () => {
  const storage = new MockMemento();
  const history = new History(storage);
  for (let i = 0; i < 200; i++) {
    const serverSource: ServerSource = {
      type: "SERVER",
      host: "",
      usePlaintext: false,
    };

    const request: Request = {
      file: undefined,
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

    history.add(value);
  }
  expect(storage.values.length).toBe(100);
});

test(`list`, () => {
  const storage = new MockMemento();
  const history = new History(storage);

  const serverSource: ServerSource = {
    type: "SERVER",
    host: "",
    usePlaintext: false,
  };

  const request: Request = {
    file: undefined,
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

  history.add(value);

  let resp = history.list();
  expect(resp).toStrictEqual([
    {
      path: "example",
      importPath: `/`,
      json: "",
      host: {
        adress: ``,
        plaintext: true,
      },
      call: "",
      callTag: "",
      headers: [],
      maxMsgSize: 420,
      code: "",
      response: "",
      time: 0,
      date: "",
      service: "",
      inputMessageTag: "",
      inputMessageName: "",
      outputMessageName: "",
      protoName: "",
      hosts: [],
      expectedResponse: "",
      expectedCode: "",
      expectedTime: 0,
      markdown: "",
    },
  ]);
});

test(`clean`, () => {
  const storage = new MockMemento();
  const history = new History(storage);
  history.add({
    path: "example",
    importPath: `/`,
    json: "",
    server: {
      adress: ``,
      plaintext: true,
    },
    callTag: "",
    call: "",
    headers: [],
    maxMsgSize: 420,
    code: "",
    content: "",
    time: 0,
    date: "",
    service: "",
    inputMessageTag: "",
    inputMessageName: "",
    outputMessageName: "",
    protoName: "",
    hosts: [],
    content: "",
    code: "",
    time: 0,
    passed: undefined,
    markdown: "",
  });

  history.clean();
  expect(storage.values).toBeUndefined();
});
