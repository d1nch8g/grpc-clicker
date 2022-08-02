import { Host, Hosts } from "./hosts";
import { Memento } from "vscode";
import { T } from "../../dist/tk/utilities/design-tokens/create";

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
  const memento = new MockMemento();
  const hosts = new Hosts(memento);
  const host: Host = {
    adress: "host",
    description: "",
    current: false,
  };
  expect(hosts.add(host)).toBeNull();
  expect(hosts.add(host)).toStrictEqual(
    new Error(`host you are trying to add already exists`)
  );
});

test(`list`, () => {
  const memento = new MockMemento();
  const hosts = new Hosts(memento);
  memento.values = [`{"adress": "host","description": "","current": false}`];
  expect(hosts.list()).toStrictEqual([
    {
      adress: "host",
      description: "",
      current: false,
    },
  ]);
});

test(`remove`, () => {
  const memento = new MockMemento();
  const hosts = new Hosts(memento);
  memento.values = [`{"adress": "host","description": "","current": false}`];
  hosts.remove(`host`);
  expect(memento.values).toStrictEqual([]);
});
