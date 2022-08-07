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
    this.values = value;
    return;
  }
}

test(`add`, () => {
  const storage = new MockMemento();
  const history = new History(storage);
  for (let i = 0; i < 200; i++) {
    history.add({
      path: "example",
      reqJson: "",
      host: "",
      call: "",
      plaintext: false,
      metadata: [],
      maxMsgSize: i,
      code: "",
      respJson: "",
      time: "",
      errmes: "",
      date: "",
      service: "",
      inputMessageTag: "",
      inputMessageName: "",
      outputMessageName: "",
    });
  }
  expect(storage.values.length).toBe(100);
});

test(`list`, () => {
  const storage = new MockMemento();
  const history = new History(storage);
  history.add({
    path: "example",
    reqJson: "",
    host: "",
    call: "",
    plaintext: false,
    metadata: [],
    maxMsgSize: 420,
    code: "",
    respJson: "",
    time: "",
    errmes: "",
    date: "",
    service: "",
    inputMessageTag: "",
    inputMessageName: "",
    outputMessageName: "",
  });

  let resp = history.list();
  expect(resp).toStrictEqual([
    {
      path: "example",
      reqJson: "",
      host: "",
      call: "",
      plaintext: false,
      metadata: [],
      maxMsgSize: 420,
      code: "",
      respJson: "",
      time: "",
      errmes: "",
      date: "",
      service: "",
      inputMessageTag: "",
      inputMessageName: "",
      outputMessageName: "",
    },
  ]);
});

test(`clean`, () => {
  const storage = new MockMemento();
  const history = new History(storage);
  history.add({
    path: "example",
    reqJson: "",
    host: "",
    call: "",
    plaintext: false,
    metadata: [],
    maxMsgSize: 420,
    code: "",
    respJson: "",
    time: "",
    errmes: "",
    date: "",
    service: "",
    inputMessageTag: "",
    inputMessageName: "",
    outputMessageName: "",
  });

  history.clean();
  expect(storage.values).toBeUndefined();
});
