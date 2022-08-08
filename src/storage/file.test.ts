import { Memento } from "vscode";
import { ProtoFile } from "../grpcurl/grpcurl";
import { Proto, ProtoType } from "../grpcurl/parser";
import { ProtoFiles } from "./file";

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
  const protos = new ProtoFiles(memento);
  var proto: ProtoFile = {
    type: ProtoType.proto,
    name: "test",
    services: [],
    path: "",
    hosts: [],
  };
  expect(protos.add(proto)).toBeUndefined();
  expect(protos.add(proto)).toStrictEqual(
    new Error(`proto file you are trying to add already exists`)
  );
});

test(`list`, () => {
  const memento = new MockMemento();
  const headers = new ProtoFiles(memento);
  var proto: ProtoFile = {
    type: ProtoType.proto,
    name: "test",
    services: [],
    path: "",
    hosts: [],
  };
  memento.values = [JSON.stringify(proto)];
  expect(headers.list()).toStrictEqual([proto]);
});

test(`remove`, () => {
  const memento = new MockMemento();
  const headers = new ProtoFiles(memento);
  var proto: ProtoFile = {
    type: ProtoType.proto,
    name: "test",
    services: [],
    path: "path",
    hosts: [],
  };
  memento.values = [JSON.stringify(proto)];
  headers.remove(`path`);
  expect(memento.values).toStrictEqual([]);
});
