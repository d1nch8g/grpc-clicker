<script>
  import TopPanel from "./TopPanel.svelte";
  import Request from "./Request.svelte";
  import Response from "./Response.svelte";

  $: path = ``;
  $: protoName = ``;
  $: service = ``;
  $: call = ``;
  $: inputMessageTag = ``;
  $: inputMessageName = ``;
  $: outputMessageName = ``;
  $: tlsOn = ``;
  $: host = ``;
  $: reqJson = ``;
  $: metadata = [];
  $: maxMsgSize = ``;
  $: code = ``;
  $: respJson = ``;
  $: time = ``;
  $: date = ``;
  $: errmes = ``;
  $: hosts = [];

  window.addEventListener("message", (event) => {
    console.log(`${event.data}`);
    const obj = JSON.parse(`${event.data}`);
    path = obj.path;
    protoName = obj.protoName;
    service = obj.service;
    call = obj.call;
    inputMessageTag = obj.inputMessageTag;
    inputMessageName = obj.inputMessageName;
    outputMessageName = obj.outputMessageName;
    tlsOn = obj.tlsOn;
    host = obj.host;
    reqJson = obj.reqJson;
    metadata = obj.metadata;
    maxMsgSize = obj.maxMsgSize;
    code = obj.code;
    respJson = obj.respJson;
    time = obj.time;
    date = obj.date;
    errmes = obj.errmes;
    hosts = obj.hosts;

    hosts.splice(hosts.indexOf(obj.host), 1);
    hosts = [obj.host].concat(hosts);
  });

  function send() {
    respJson = "waiter";
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
  service="{service}"
  protoName="{protoName}"
  call="{call}"
  hosts="{hosts}"
  onSend="{send}"
/>

<table>
  <td>
    <Request reqName="{inputMessageName}" edit="{edit}" bind:reqJson />
  </td>

  <td>
    <Response respName="{outputMessageName}" bind:respJson />
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
