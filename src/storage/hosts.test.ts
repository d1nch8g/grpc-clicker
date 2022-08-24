import { Memento } from "vscode";
import { Header } from "./headers";
import { Host, Hosts } from "./hosts";

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

const host: Host = {
  adress: "localhost:8080",
  plaintext: true,
};
test(`add`, () => {
  const memento = new MockMemento();
  const hosts = new Hosts(memento);
  expect(hosts.get()).toStrictEqual([host]);
  hosts.save([host, host]);
  expect(hosts.get()).toStrictEqual([host, host]);
});
