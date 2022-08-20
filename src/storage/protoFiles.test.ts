import { Memento } from "vscode";
import { FileSource } from "../grpcurl/caller";
import { Proto } from "../grpcurl/parser";
import { ProtoFile, ProtoFiles } from "./protoFiles";

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

const source: FileSource = {
  type: "FILE",
  filePath: "path",
  importPath: "",
};

const proto: Proto = {
  type: "PROTO",
  services: [],
};

const file: ProtoFile = {
  source: source,
  proto: proto,
};

test(`add`, () => {
  const memento = new MockMemento();
  const protos = new ProtoFiles(memento);
  expect(protos.add(file)).toBeUndefined();
  expect(protos.add(file)).toStrictEqual(
    new Error(`proto file you are trying to add already exists`)
  );
});

test(`list`, () => {
  const memento = new MockMemento();
  const protos = new ProtoFiles(memento);
  memento.values = [JSON.stringify(file)];
  expect(protos.list()).toStrictEqual([file]);
});

test(`remove`, () => {
  const memento = new MockMemento();
  const protos = new ProtoFiles(memento);
  memento.values = [JSON.stringify(file)];
  protos.remove(`path`);
  expect(memento.values).toStrictEqual([]);
});
