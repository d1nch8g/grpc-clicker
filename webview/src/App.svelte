<script>
  import TopPanel from "./TopPanel.svelte";
  import Request from "./Request.svelte";
  import Response from "./Response.svelte";

  $: proto = "";
  $: version = "";
  $: service = "";
  $: call = "";
  $: adress = "";

  $: reqName = "";
  $: reqJson = "";

  $: respName = "";
  $: response = "";

  window.addEventListener("message", (event) => {
    const obj = JSON.parse(`${event.data}`);
    if (obj.rez) {
      response = obj.output;
      return;
    }
    proto = obj.proto;
    version = obj.version;
    service = obj.service;
    call = obj.call;
    adress = obj.adress;
    reqName = obj.reqName;
    reqJson = obj.reqJson;
    respName = obj.respName;
  });

  function sendMessageToVscode() {
    vscode.postMessage({
      command: "req",
      text: reqJson,
    });
  }
</script>

<TopPanel
  proto="{proto}"
  version="{version}"
  service="{service}"
  call="{call}"
  adress="{adress}"
  onClick="{sendMessageToVscode}"
/>

<table>
  <td>
    <Request reqName="{reqName}" bind:reqJson />
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
