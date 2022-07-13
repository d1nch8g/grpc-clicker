import { WebviewPortMapping } from "vscode";

export class GrpcCallPortMapping implements WebviewPortMapping {
  constructor() {
    this.webviewPort = 5500;
    this.extensionHostPort = 5500;
  }

  webviewPort: number;
  extensionHostPort: number;
}
