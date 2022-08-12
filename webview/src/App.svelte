<script>
  import TopPanel from "./TopPanel.svelte";
  import Request from "./Request.svelte";
  import Response from "./Response.svelte";

  $: data = {
    path: ``,
    protoName: ``,
    service: ``,
    call: ``,
    callTag: ``,
    inputMessageTag: ``,
    inputMessageName: ``,
    outputMessageName: ``,
    host: {
      adress: ``,
      plaintext: false,
    },
    json: "",
    maxMsgSize: 0,
    code: "",
    response: "",
    time: "",
    date: "",
    metadata: [],
    hosts: [],
    expectedResponse: "",
    expectedCode: "",
    expectedTime: "",
  };

  window.addEventListener("message", (event) => {
    data = JSON.parse(`${event.data}`);
  });

  function onSend() {
    data.response = "waiter";
    vscode.postMessage({
      command: "send",
    });
  }

  function onEditRequest() {
    vscode.postMessage({
      command: "edit",
      text: data.json,
    });
  }

  function onExport() {
    vscode.postMessage({
      command: "export",
    });
  }

  function onHost(host) {
    vscode.postMessage({
      command: "host",
      text: JSON.stringify(host),
    });
  }
</script>

<TopPanel
  data="{data}"
  onSend="{onSend}"
  onExport="{onExport}"
  onHost="{onHost}"
/>

<table>
  <td>
    <Request bind:data edit="{onEditRequest}" />
  </td>
  <td>
    <Response bind:data />
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
