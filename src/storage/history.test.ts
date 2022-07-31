import { Memento } from "vscode";
import { T } from "../../dist/tk/utilities/design-tokens/create";
import { History } from "./history";

class MockMemento implements Memento {
  values: string[] = [];

  keys(): readonly string[] {
    throw new Error("Method not implemented.");
  }
  get<T>(key: string): T;
  get<T>(key: string, defaultValue: T): T;
  get(key: unknown, defaultValue?: unknown): T | T {
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
      method: "",
      tlsOn: false,
      metadata: [],
      maxMsgSize: i,
      code: "",
      json: "",
      time: "",
      message: "",
      fileName: "",
      protoName: "",
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
    method: "",
    tlsOn: false,
    metadata: [],
    maxMsgSize: 420,
    code: "",
    json: "",
    time: "",
    message: "",
    fileName: "",
    protoName: "",
  });

  let resp = history.list();
  expect(resp).toStrictEqual([
    {
      path: "example",
      reqJson: "",
      host: "",
      method: "",
      tlsOn: false,
      metadata: [],
      maxMsgSize: 420,
      code: "",
      json: "",
      time: "",
      message: "",
      fileName: "",
      protoName: "",
    },
  ]);
});
