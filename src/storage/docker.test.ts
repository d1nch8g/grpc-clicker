import { Memento } from "vscode";
import { Docker } from "./docker";
import { Header, Headers } from "./headers";

class MockMemento implements Memento {
  isOn: boolean;
  keys(): readonly string[] {
    throw new Error("Method not implemented.");
  }
  get<T>(key: string): T;
  get<T>(key: string, defaultValue: T): T;
  get(key: unknown, defaultValue?: unknown): any {
    if (this.isOn === undefined) {
      return defaultValue;
    }
    return this.isOn;
  }
  update(key: string, value: any): Thenable<void> {
    this.isOn = value;
    return;
  }
}

test(`docker`, () => {
  const memento = new MockMemento();
  const docker = new Docker(memento);
  expect(docker.isOn()).toBe(false);
  docker.turnOn();
  expect(docker.isOn()).toBe(true);
  docker.turnOff();
  expect(docker.isOn()).toBe(false);
});
