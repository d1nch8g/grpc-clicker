import { Memento } from "vscode";

export class Metadata {
  private readonly key: string = "grpc-clicker-metadata";
  constructor(private memento: Memento) {}

  private saveMetadataValues(metadataValues: Metadata[]) {
    let metadataStrings: string[] = [];
    for (const metdata of metadataValues) {
      metadataStrings.push(JSON.stringify(metdata));
    }
    this.memento.update(this.key, metadataStrings);
  }

  list(): Metadata[] {
    let metadataStrings = this.memento.get<string[]>(this.key, []);
    let metadataValues: Metadata[] = [];
    for (const metadataString of metadataStrings) {
      metadataValues.push(JSON.parse(metadataString));
    }
    return metadataValues;
  }

  
}

export interface Metadata {
  value: string;
  active: boolean;
}
