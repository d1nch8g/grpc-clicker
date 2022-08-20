import { Memento } from "vscode";
import { Expectations, Request } from "../grpcurl/grpcurl";

export class Collections {
  private readonly key: string = "grpc-clicker-collections";
  constructor(private memento: Memento) {}

  save(collections: Collection[]) {
    let collectionStrings: string[] = [];
    for (const collection of collections) {
      collectionStrings.push(JSON.stringify(collection));
    }
    this.memento.update(this.key, collectionStrings);
  }

  list(): Collection[] {
    let collectionStrings = this.memento.get<string[]>(this.key, []);
    let collectionValues: Collection[] = [];
    for (const collectionString of collectionStrings) {
      collectionValues.push(JSON.parse(collectionString));
    }
    return collectionValues;
  }

  addCollection(collection: Collection): string | undefined {
    let collections = this.list();
    for (const savedValue of collections) {
      if (savedValue.name === collection.name) {
        return `collection with same name exists`;
      }
    }
    collections.push(collection);
    this.save(collections);
    return undefined;
  }

  removeCollection(collectionName: string) {
    let collections = this.list();
    for (let i = 0; i < collections.length; i++) {
      if (collections[i].name === collectionName) {
        collections.splice(i, 1);
      }
    }
    this.save(collections);
    return collections;
  }

  addTest(collectionName: string, test: Test): string | undefined {
    const collections = this.list();
    for (const collection of collections) {
      if (collection.name === collectionName) {
        for (const savedTest of collection.tests) {
          if (savedTest.name === test.name) {
            return `test with that name already exists`;
          }
        }
      }
    }
    this.save(collections);
    return undefined;
  }

  removeTest(collectionName: string, testName: string) {}

  updateCollection(collection: Collection) {
    const collections = this.list();
    collections.forEach((col, idx) => {
      if (col.name === collection.name) {
        collections[idx] = collection;
      }
    });
    this.save(collections);
  }
}

export interface Collection {
  name: string;
  tests: Test[];
}

export interface Test {
  name: string;
  request: Request;
  expectations: Expectations;
  passed: boolean | undefined;
  markdown: string;
}
