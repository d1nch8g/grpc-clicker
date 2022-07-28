<script>
  import TopPanel from "./TopPanel.svelte";
  import Request from "./Request.svelte";
  import Response from "./Response.svelte";

  $: proto = "";
  $: service = "";
  $: call = "";
  $: hosts = [];

  $: reqName = "";
  $: reqJson = "";

  $: respName = "";
  $: response = "";

  window.addEventListener("message", (event) => {
    const obj = JSON.parse(`${event.data}`);
    proto = obj.proto;
    service = obj.service;
    call = obj.call;
    hosts = obj.hosts;
    hosts.splice(hosts.indexOf(obj.host), 1);
    hosts = [obj.host].concat(hosts);
    reqName = obj.reqName;
    reqJson = obj.reqJson;
    respName = obj.respName;
    response = obj.response;
    response = response + obj.error;
  });

  function send() {
    vscode.postMessage({
      command: "send",
      text: reqJson,
    });
  }

  function edit() {
    vscode.postMessage({
      command: "edit",
      text: reqJson,
    });
  }
</script>

<TopPanel
  proto="{proto}"
  service="{service}"
  call="{call}"
  hosts="{hosts}"
  onSend="{send}"
/>

<table>
  <td>
    <Request reqName="{reqName}" edit="{edit}" bind:reqJson />
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
