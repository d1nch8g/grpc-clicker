export class Field {
  public type: string;
  public name: string;
  constructor(line: string) {
    let splitted = line.split(" ");
    if (line.includes("map") && line.includes("<") && line.includes(">")) {
      var key = line.replace("map<", "").replace(",", "");
      var value = line.replace(">", "");
      this.type = `map<${key}, ${value}>`;
      this.name = splitted[4];
    }
  }
}
