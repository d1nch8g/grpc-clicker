import { Memento } from "vscode";
import { Expectations, Request, TestResult } from "../grpcurl/grpcurl";

/**
 * Collection containing multiple tests
 */
export interface Collection {
  /**
   * Public user defined name visible in UI name of collection
   */
  name: string;
  /**
   * Collection tests with unique tags
   */
  tests: Test[];
}

/**
 * Single test that can be executed
 */
export interface Test {
  /**
   * Input request parameters that will be executed
   */
  request: Request;
  /**
   * Expected results of test execution
   */
  expectations: Expectations;
  /**
   * Result of test execution, undefined if test have not been runned.
   */
  result: TestResult | undefined;
}

/**
 * Storage for collections with tests
 */
export class Collections {
  constructor(private memento: Memento) {}
  save(collections: Collection[]) {
    this.memento.update(`collections`, collections);
  }

  list(): Collection[] {
    return this.memento.get(`collections`, []);
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
          if (this.compareTests(test, savedTest)) {
            return `test exists`;
          }
        }
        collection.tests.push(test);
      }
    }
    this.save(collections);
    return undefined;
  }

  removeTest(collectionName: string, test: Test) {
    const collections = this.list();
    for (const collection of collections) {
      if (collection.name === collectionName) {
        for (let i = 0; i < collection.tests.length; i++) {
          if (this.compareTests(collection.tests[i], test)) {
            collection.tests.splice(i, 1);
            this.save(collections);
            return;
          }
        }
      }
    }
  }

  /**
   * Collection will be automatically updated based on it's name.
   */
  updateCollection(collection: Collection) {
    const collections = this.list();
    collections.forEach((col, idx) => {
      if (col.name === collection.name) {
        collections[idx] = collection;
      }
    });
    this.save(collections);
  }

  private compareTests(first: Test, second: Test): boolean {
    return (
      first.request.callTag === second.request.callTag &&
      first.request.content === second.request.content &&
      first.expectations.code === second.expectations.code
    );
  }
}
