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

grpcurl -emit-defaults -d '{"message":false}' -plaintext localhost:9080 pb.v1.Basics/BoolCall

