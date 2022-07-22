<script>
  import TopPanel from "./TopPanel.svelte";
  import Request from "./Request.svelte";
  import Response from "./Response.svelte";
  const vscode = acquireVsCodeApi();

  $: proto = "";
  $: version = "";
  $: service = "";
  $: call = "";
  $: adress = "";

  $: reqName = "";
  $: reqJson = "";
  $: respName = "";

  window.addEventListener("message", (event) => {
    console.log(event.data);
    const obj = JSON.parse(`${event.data}`);
    proto = obj.proto;
    version = obj.version;
    service = obj.service;
    call = obj.call;
    adress = obj.adress;
    reqName = obj.reqName;
    reqJson = obj.reqJson;
    respName = obj.respName;
  });

  function sendVscMsg() {}
</script>

<div class="top-container">
  <TopPanel
    proto="{proto}"
    version="{version}"
    service="{service}"
    call="{call}"
    adress="{adress}"
  />
</div>

<table>
  <td class="left">
    <Request reqName="{reqName}" bind:reqJson />
  </td>

  <td>
    <Response respName="{respName}" />
  </td>
</table>

<style>
  .top-container {
    padding-top: 2%;
    padding-left: 6%;
    padding-right: 6%;
  }

  table {
    width: 100%;
  }

  td,
  tr {
    height: 100%;
    width: 50%;
  }

  td.left {
    border-right: 1px solid;
  }
</style>
