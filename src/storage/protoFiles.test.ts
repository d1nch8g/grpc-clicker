import { Memento } from "vscode";
import { ProtoFile } from "../grpcurl/grpcurl";
import { Proto, ProtoType } from "../grpcurl/parser";
import { ProtoFiles } from "./protoFiles";

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
  const protos = new ProtoFiles(memento);
  var proto: ProtoFile = {
    type: ProtoType.proto,
    services: [],
    path: "",
    hosts: [],
  };
  memento.values = [JSON.stringify(proto)];
  expect(protos.list()).toStrictEqual([proto]);
});

test(`remove`, () => {
  const memento = new MockMemento();
  const protos = new ProtoFiles(memento);
  var proto: ProtoFile = {
    type: ProtoType.proto,
    services: [],
    path: "path",
    hosts: [],
  };
  memento.values = [JSON.stringify(proto)];
  protos.remove(`path`);
  expect(memento.values).toStrictEqual([]);
});

test(`add host`, () => {
  const memento = new MockMemento();
  const protos = new ProtoFiles(memento);
  var proto: ProtoFile = {
    type: ProtoType.proto,
    services: [],
    path: "path",
    hosts: [],
  };
  memento.values = [JSON.stringify(proto)];
  protos.addHost(`path`, {
    adress: "testx",
    plaintext: true,
  });
  let host = protos.list()[0].hosts[0];
  expect(host).toStrictEqual({
    adress: "testx",
    plaintext: true,
  });
});

test(`remove host`, () => {
  const memento = new MockMemento();
  const protos = new ProtoFiles(memento);
  var proto: ProtoFile = {
    type: ProtoType.proto,
    services: [],
    path: "path",
    hosts: [
      {
        adress: "testx",
        plaintext: true,
      },
    ],
  };
  memento.values = [JSON.stringify(proto)];
  protos.removeHost(`path`, {
    adress: "testx",
    plaintext: true,
  });
  expect(protos.list()[0].hosts.length).toBe(0);
});
