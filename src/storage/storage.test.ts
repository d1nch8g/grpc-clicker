import { Memento } from "vscode";
import { Storage } from "./storage";

class MockMemento implements Memento {
  keys(): readonly string[] {
    return [];
  }
  get<T>(key: string): T;
  get<T>(key: string, defaultValue: T): T;
  get(key: unknown, defaultValue?: unknown): any {
    return [];
  }
  update(key: string, value: any): Thenable<void> {
    return;
  }
}

test(`create`, () => {
  let storage = new Storage(new MockMemento());
  storage.cleanCache();
});
