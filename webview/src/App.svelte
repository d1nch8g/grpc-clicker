<script>
  import TopPanel from "./TopPanel.svelte";
  import Request from "./Request.svelte";
  import Response from "./Response.svelte";

  $: path = "";
  $: service = "";
  $: call = "";
  $: inputMessageTag = "";
  $: inputMessageName = "";
  $: outputMessageName = "";
  $: tlsOn = "";
  $: host = "";
  $: reqJson = "";
  $: metadata = [];
  $: maxMsgSize = "";
  $: code = "";
  $: respJson = "";
  $: time = "";
  $: date = "";
  $: errmes = "";
  $: hosts = [];

  window.addEventListener("message", (event) => {
    console.log(`${event.data}`);
    const obj = JSON.parse(`${event.data}`);
    path = path;
    service = service;
    call = call;
    inputMessageTag = inputMessageTag;
    inputMessageName = inputMessageName;
    outputMessageName = outputMessageName;
    tlsOn = tlsOn;
    host = host;
    reqJson = reqJson;
    metadata = metadata;
    maxMsgSize = maxMsgSize;
    code = code;
    respJson = respJson;
    time = time;
    date = date;
    errmes = errmes;
    hosts = hosts;

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

<TopPanel service="{service}" call="{call}" hosts="{hosts}" onSend="{send}" />

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
