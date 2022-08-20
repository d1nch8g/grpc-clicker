import { Memento } from "vscode";
import { Expectations } from "../grpcurl/grpcurl";

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

  add(collection: Collection) {
    let collections = this.list();
    for (const savedValue of collections) {
      if (savedValue.name === collection.name) {
        return new Error(`collection with same name exists`);
      }
    }
    collections.push(collection);
    this.save(collections);
    return undefined;
  }

  remove(name: string) {
    let collections = this.list();
    for (let i = 0; i < collections.length; i++) {
      if (collections[i].name === name) {
        collections.splice(i, 1);
      }
    }
    this.save(collections);
    return collections;
  }

  addTest(name: string, data: SavedTest) {
    const collections = this.list();
    for (const savedValue of collections) {
      if (savedValue.name === name) {
        savedValue.tests.push(data);
      }
    }
    this.save(collections);
  }

  update(collection: Collection) {
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
  tests: SavedTest[];
}

export interface SavedTest extends Expectations {
  passed: boolean | undefined;
  markdown: string;
}
