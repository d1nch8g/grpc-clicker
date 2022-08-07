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
  $: plaintext = false;
  $: host = ``;
  $: json = ``;
  $: maxMsgSize = 0;
  $: code = ``;
  $: response = ``;
  $: time = ``;
  $: date = ``;
  $: errmes = ``;
  $: metadata = [];
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
    plaintext = obj.plaintext;
    host = obj.host;
    json = obj.json;
    maxMsgSize = obj.maxMsgSize;
    code = obj.code;
    response = obj.response;
    time = obj.time;
    date = obj.date;
    errmes = obj.errmes;
    metadata = obj.metadata;
    hosts = obj.hosts;
    if (errmes !== null) {
      respJson = errmes;
    }
    hosts.splice(hosts.indexOf(obj.host), 1);
    hosts = [obj.host].concat(hosts);
  });

  function onSend() {
    json = "waiter";
    vscode.postMessage({
      command: "send",
      text: json,
    });
  }

  function onEdit() {
    vscode.postMessage({
      command: "edit",
      text: json,
    });
  }

  function onExport() {
    console.log(`making attemp to export`);
    const request = JSON.stringify({
      path: path,
      protoName: protoName,
      service: service,
      call: call,
      inputMessageTag: inputMessageTag,
      inputMessageName: inputMessageName,
      outputMessageName: outputMessageName,
      plaintext: plaintext,
      host: host,
      json: json,
      maxMsgSize: maxMsgSize,
      code: code,
      response: response,
      time: time,
      date: date,
      errmes: errmes,
      metadata: metadata,
      hosts: hosts,
    });
    vscode.postMessage({
      command: "export",
      text: request,
    });
  }
</script>

<TopPanel
  service="{service}"
  protoName="{protoName}"
  call="{call}"
  hosts="{hosts}"
  onSend="{onSend}"
  onExport="{onExport}"
/>

<table>
  <td>
    <Request reqName="{inputMessageName}" edit="{onEdit}" bind:json />
  </td>

  <td>
    <Response
      respName="{outputMessageName}"
      code="{code}"
      time="{time}"
      date="{date}"
      bind:response
    />
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
