import { Memento } from "vscode";
import { ProtoServer } from "../grpcurl/grpcurl";
import { ProtoType } from "../grpcurl/parser";
import { ProtoServers } from "./hosts";

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
  const hosts = new ProtoServers(memento);
  const host: ProtoServer = {
    type: ProtoType.proto,
    host: "localhost:12201",
    plaintext: true,
    name: "pb.v1",
    services: [],
  };
  expect(hosts.add(host)).toBeUndefined();
  expect(hosts.add(host)).toStrictEqual(
    new Error(`host you are trying to add already exists`)
  );
});

test(`list`, () => {
  const memento = new MockMemento();
  const hosts = new ProtoServers(memento);
  const host: ProtoServer = {
    type: ProtoType.proto,
    host: "localhost:12201",
    plaintext: true,
    name: "pb.v1",
    services: [],
  };
  memento.values = [JSON.stringify(host)];
  expect(hosts.list()).toStrictEqual([host]);
});

test(`remove`, () => {
  const memento = new MockMemento();
  const hosts = new ProtoServers(memento);
  const host: ProtoServer = {
    type: ProtoType.proto,
    host: "localhost:12201",
    plaintext: true,
    name: "pb.v1",
    services: [],
  };
  memento.values = [JSON.stringify(host)];
  hosts.remove(`localhost:12201`);
  expect(memento.values).toStrictEqual([]);
});
