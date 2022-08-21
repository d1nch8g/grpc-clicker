import { Memento } from "vscode";
import { ServerSource } from "../grpcurl/caller";
import { Expectations, Request, TestResult } from "../grpcurl/grpcurl";
import { Collection, Collections, Test } from "./collections";

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
  const collection = new Collections(memento);

  const header: Collection = {
    name: "testcol",
    tests: [],
  };

  expect(collection.addCollection(header)).toBeUndefined();
  expect(collection.addCollection(header)).toStrictEqual(
    `collection with same name exists`
  );
});

test(`list`, () => {
  const memento = new MockMemento();
  const collections = new Collections(memento);

  memento.values = [`{"name": "testcol", "tests": []}`];

  const expectValues = [
    {
      name: "testcol",
      tests: [],
    },
  ];

  expect(collections.list()).toStrictEqual(expectValues);
});

const serverSource: ServerSource = {
  type: "SERVER",
  host: "",
  usePlaintext: false,
};

const request: Request = {
  file: undefined,
  content: "",
  server: serverSource,
  callTag: "",
  maxMsgSize: 0,
  headers: [],
};

const testExpectations: Expectations = {
  code: "OK",
  time: 0,
  content: undefined,
};

const testResult: TestResult = {
  passed: false,
  mistakes: [],
};

const singleTest: Test = {
  request: request,
  expectations: testExpectations,
  result: testResult,
};

test(`remove`, () => {
  const memento = new MockMemento();
  const collections = new Collections(memento);

  memento.values = [`{"name": "testcol", "tests": []}`];

  collections.removeCollection(`testcol`);

  expect(memento.values).toStrictEqual([]);
});

test(`add test`, () => {
  const memento = new MockMemento();
  const collections = new Collections(memento);

  const collection: Collection = {
    name: "testcol",
    tests: [],
  };
  memento.values = [JSON.stringify(collection)];

  collections.addTest(`testcol`, singleTest);

  expect(collections.list()[0].tests.length).toBe(1);
});

test(`update`, () => {
  const memento = new MockMemento();
  const collections = new Collections(memento);
  const collection: Collection = {
    name: "testcol",
    tests: [],
  };

  memento.values = [JSON.stringify(collection)];

  collection.tests.push(singleTest);

  collections.updateCollection(collection);
  expect(collections.list()[0].tests.length).toBe(1);
});

test(`remove test`, () => {
  const memento = new MockMemento();
  const collections = new Collections(memento);

  const collection: Collection = {
    name: "testcol",
    tests: [singleTest],
  };

  collections.addCollection(collection);
  collections.removeTest(`testcol`, singleTest);
  const cols = collections.list();
  expect(cols[0].tests.length).toBe(0);
});
