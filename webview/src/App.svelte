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
  $: plaintext = ``;
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
    plaintext = obj.plaintext;
    host = obj.host;
    reqJson = obj.reqJson;
    metadata = obj.metadata;
    maxMsgSize = obj.maxMsgSize;
    hosts = obj.hosts;

    code = obj.code;
    respJson = obj.respJson;
    time = obj.time;
    date = obj.date;
    errmes = obj.errmes;

    if (errmes !== null) {
      respJson = errmes;
    }

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
      reqJson: reqJson,
      maxMsgSize: maxMsgSize,
      code: code,
      respJson: respJson,
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
  onSend="{send}"
  onExport="{onExport}"
/>

<table>
  <td>
    <Request reqName="{inputMessageName}" edit="{edit}" bind:reqJson />
  </td>

  <td>
    <Response
      respName="{outputMessageName}"
      code="{code}"
      time="{time}"
      date="{date}"
      bind:respJson
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
