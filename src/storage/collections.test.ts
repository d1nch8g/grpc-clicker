import { Memento } from "vscode";
import { Collection, Collections } from "./collections";

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
  const memento = new MockMemento();
  const collection = new Collections(memento);
  const header: Collection = {
    name: "testcol",
    tests: [],
  };
  expect(collection.add(header)).toBeUndefined();
  expect(collection.add(header)).toStrictEqual(
    new Error(`collection with same name exists`)
  );
});

test(`list`, () => {
  const memento = new MockMemento();
  const collections = new Collections(memento);
  memento.values = [`{"name": "testcol", "tests": []}`];
  expect(collections.list()).toStrictEqual([
    {
      name: "testcol",
      tests: [],
    },
  ]);
});

test(`remove`, () => {
  const memento = new MockMemento();
  const collections = new Collections(memento);
  memento.values = [`{"name": "testcol", "tests": []}`];
  collections.remove(`testcol`);
  expect(memento.values).toStrictEqual([]);
});
