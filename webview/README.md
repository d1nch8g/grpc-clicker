# Page for grpc clicker application

```js
const vscode = acquireVsCodeApi();

vscode.postMessage({
  command: "alert",
  text: "🐛 das me ",
});

window.addEventListener("message", (event) => {
  console.log(event.data);
});
```
grpcurl  -max-msg-sz 4194304 -import-path / -proto c:\Users\dangd\OneDrive\Документы\grpclicker_vscode\server\api.proto -d "{\"message\":\"\"}" -plaintext  localhost:8080 BytesCall
grpcurl  -max-msg-sz 4194304 -import-path / -proto c:\Users\dangd\OneDrive\Документы\grpclicker_vscode\server\api.proto -d "{\"@type\":\"type.googleapis.com/google.protobuf.Empty\",\"value\":{}}" -plaintext  localhost:8080 AnyCall