<script>
  import TopPanel from "./TopPanel.svelte";
  import Request from "./Request.svelte";
  import Response from "./Response.svelte";

  $: proto = "";
  $: version = "";
  $: service = "";
  $: call = "";
  $: host = "";

  $: reqName = "";
  $: reqJson = "";

  $: respName = "";
  $: response = "";

  window.addEventListener("message", (event) => {
    const obj = JSON.parse(`${event.data}`);
    proto = obj.proto;
    version = obj.version;
    service = obj.service;
    call = obj.call;
    host = obj.host;
    reqName = obj.reqName;
    reqJson = obj.reqJson;
    respName = obj.respName;
    response = obj.response;
  });

  function sendMessageToVscode() {
    vscode.postMessage({
      command: "req",
      text: reqJson,
    });
  }

  function onInputEdited() {
    vscode.postMessage({
      command: "input",
      text: reqJson,
    });
  }
</script>

<TopPanel
  proto="{proto}"
  version="{version}"
  service="{service}"
  call="{call}"
  host="{host}"
  onClick="{sendMessageToVscode}"
/>

<table>
  <td>
    <Request reqName="{reqName}" onChange="{onInputEdited}" bind:reqJson />
  </td>

  <td>
    <Response respName="{respName}" bind:response />
  </td>
</table>

<style>
  table {
    width: 100%;
  }

  td {
    height: 100%;
    width: 50%;
  }
</style>
