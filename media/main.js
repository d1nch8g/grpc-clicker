// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.

(function () {
  const vscode = acquireVsCodeApi();

  console.log("hello from vscode");

  vscode.postMessage({
    command: "alert",
    text: "🐛  on line ",
  });
})();
