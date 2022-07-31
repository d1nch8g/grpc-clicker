import { T } from "../../dist/tk/utilities/design-tokens/create";
import { Memento } from "vscode";
import { Storage } from "./storage";

class MockMemento implements Memento {
  keys(): readonly string[] {
    throw new Error("Method not implemented.");
  }
  get<T>(key: string): T;
  get<T>(key: string, defaultValue: T): T;
  get(key: unknown, defaultValue?: unknown): T | T {
    throw new Error("Method not implemented.");
  }
  update(key: string, value: any): Thenable<void> {
    throw new Error("Method not implemented.");
  }
}

test(`create`, () => {
  let storage = new Storage(new MockMemento());
});
