import { Memento } from "vscode";
import { ServerSource } from "../grpcurl/caller";
import { Proto } from "../grpcurl/parser";
import { ProtoServer, ProtoServers } from "./protoServer";

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

const source: ServerSource = {
  type: "SERVER",
  host: "localhost:12201",
  usePlaintext: false,
};

const server: ProtoServer = {
  source: source,
  type: "PROTO",
  services: [],
};

test(`add`, () => {
  const memento = new MockMemento();
  const hosts = new ProtoServers(memento);

  expect(hosts.add(server)).toBeUndefined();
  expect(hosts.add(server)).toStrictEqual(
    new Error(`host you are trying to add already exists`)
  );
});

test(`list`, () => {
  const memento = new MockMemento();
  const hosts = new ProtoServers(memento);

  memento.values = [JSON.stringify(server)];
  expect(hosts.list()).toStrictEqual([server]);
});

test(`remove`, () => {
  const memento = new MockMemento();
  const hosts = new ProtoServers(memento);

  memento.values = [JSON.stringify(server)];
  hosts.remove(`localhost:12201`);
  expect(memento.values).toStrictEqual([]);
});
