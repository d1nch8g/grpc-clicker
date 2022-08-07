import { Memento } from "vscode";
import { Header, Headers } from "./headers";

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
  const memento = new MockMemento();
  const headers = new Headers(memento);
  const header: Header = {
    value: "header",
    active: false,
  };
  expect(headers.add(header)).toBeUndefined();
  expect(headers.add(header)).toStrictEqual(
    new Error(`header you are trying to add already exists`)
  );
});

test(`list`, () => {
  const memento = new MockMemento();
  const headers = new Headers(memento);
  memento.values = [`{"value": "header", "active": false}`];
  expect(headers.list()).toStrictEqual([
    {
      value: "header",
      active: false,
    },
  ]);
});

test(`remove`, () => {
  const memento = new MockMemento();
  const headers = new Headers(memento);
  memento.values = [`{"value": "header", "active": false}`];
  headers.remove(`header`);
  expect(memento.values).toStrictEqual([]);
});
