import { Memento } from "vscode";
import { ProtoSource } from "../grpcurl/caller";
import { Proto } from "../grpcurl/parser";
import { Protos } from "./protos";

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

const src: ProtoSource = {
  uuid: "uniq",
  currentHost: "",
  additionalHosts: [],
  plaintext: false,
  timeout: 0,
  filePath: `value`,
  group: `value`,
  importPaths: []
};

test(`add`, () => {
  const memento = new MockMemento();
  const protos = new Protos(memento);

  expect(protos.add(src)).toBeUndefined();
  expect(protos.add(src)).toStrictEqual(
    new Error(`host you are trying to add already exists`)
  );
});

test(`list`, () => {
  const memento = new MockMemento();
  const hosts = new Protos(memento);

  memento.values = [JSON.stringify(src)];
  expect(hosts.list()).toStrictEqual([src]);
});

test(`remove`, () => {
  const memento = new MockMemento();
  const hosts = new Protos(memento);

  memento.values = [JSON.stringify(src)];
  hosts.remove(`uniq`);
  expect(memento.values).toStrictEqual([]);
});
