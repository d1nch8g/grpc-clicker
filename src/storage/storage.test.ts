import { Memento } from "vscode";
import { Storage } from "./storage";

class MockMemento implements Memento {
  version: string = `version`;
  triggered: boolean = false;
  cleaned: boolean = false;
  keys(): readonly string[] {
    this.triggered = true;
    return [`key`];
  }
  get<T>(key: string): T;
  get<T>(key: string, defaultValue: T): T;
  get(key: unknown, defaultValue?: unknown): any {
    if (key === `grpc-clicker-version`) {
      return undefined;
    }
    return undefined;
  }
  async update(key: string, value: any): Promise<void> {
    if (key === `key`) {
      this.cleaned = true;
      return undefined;
    }
    return undefined;
  }
}

test(`create`, () => {
  const memento = new MockMemento();
  new Storage(memento);
  expect(memento.triggered).toBeTruthy();
});

test(`clean`, async () => {
  const memento = new MockMemento();
  const storage = new Storage(memento);
  storage.clean();
  expect(memento.cleaned).toBeTruthy();
});
