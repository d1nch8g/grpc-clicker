// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.

(function () {
  const vscode = acquireVsCodeApi();

  vscode.postMessage({
    command: "alert",
    text: "🐛 das me ",
  });

  window.addEventListener("message", (event) => {
    console.log(event.data);
  });
})();
