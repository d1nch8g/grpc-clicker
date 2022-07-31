import { Memento } from "vscode";
import { T } from "../../dist/tk/utilities/design-tokens/create";
import { Proto } from "../grpcurl/parser";
import { Protos } from "./protos";

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
  const protos = new Protos(memento);
  expect(protos.add(`proto`)).toBeNull();
  expect(protos.add(`proto`)).toStrictEqual(
    new Error(`proto you are trying to add already exists`)
  );
});

test(`list`, () => {
  const memento = new MockMemento();
  const headers = new Protos(memento);
  memento.values = [`proto`];
  expect(headers.list()).toStrictEqual([`proto`]);
});

test(`remove`, () => {
  const memento = new MockMemento();
  const headers = new Protos(memento);
  memento.values = [`proto`];
  headers.remove(`proto`);
  expect(memento.values).toStrictEqual([]);
});
