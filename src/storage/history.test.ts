import { Memento } from "vscode";
import { History } from "./history";

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
    history.add({
      path: "example",
      importPath: `/`,
      json: "",
      host: {
        adress: ``,
        plaintext: true,
      },
      call: "",
      callTag: "",
      metadata: [],
      maxMsgSize: i,
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
      passed: undefined,
      markdown: "",
    });
  }
  expect(storage.values.length).toBe(100);
});

test(`list`, () => {
  const storage = new MockMemento();
  const history = new History(storage);
  history.add({
    path: "example",
    importPath: `/`,
    json: "",
    host: {
      adress: ``,
      plaintext: true,
    },
    call: "",
    callTag: "",
    metadata: [],
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
    passed: undefined,
    markdown: "",
  });

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
      metadata: [],
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
    host: {
      adress: ``,
      plaintext: true,
    },
    callTag: "",
    call: "",
    metadata: [],
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
    passed: undefined,
    markdown: "",
  });

  history.clean();
  expect(storage.values).toBeUndefined();
});
