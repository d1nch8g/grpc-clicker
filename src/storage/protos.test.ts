import { Memento } from "vscode";
import { Proto, ProtoType } from "../grpcurl/parser";
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

test(`add`, () => {
  const memento = new MockMemento();
  const protos = new Protos(memento);
  var proto: Proto = {
    type: ProtoType.proto,
    name: "test",
    source: "",
    services: [],
    error: undefined,
  };
  expect(protos.add(proto)).toBeUndefined();
  expect(protos.add(proto)).toStrictEqual(
    new Error(`proto file you are trying to add already exists`)
  );
});

test(`list`, () => {
  const memento = new MockMemento();
  const headers = new Protos(memento);
  memento.values = [`{"type": 0,"name": "test","path": "","services": []}`];
  expect(headers.list()).toStrictEqual([
    {
      type: ProtoType.proto,
      name: "test",
      path: "",
      services: [],
    },
  ]);
});

test(`remove`, () => {
  const memento = new MockMemento();
  const headers = new Protos(memento);
  memento.values = [
    `{"type": 0,"name": "test","source": "path","services": []}`,
  ];
  headers.remove(`path`);
  expect(memento.values).toStrictEqual([]);
});
