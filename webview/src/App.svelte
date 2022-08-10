<script>
  import TopPanel from "./TopPanel.svelte";
  import Request from "./Request.svelte";
  import Response from "./Response.svelte";

  $: reqeustData = {};

  window.addEventListener("message", (event) => {
    console.log(event.data);
    reqeustData = JSON.parse(`${event.data}`);
  });

  function onSend() {
    reqeustData.response = "waiter";
    vscode.postMessage({
      command: "send",
    });
  }

  function onEdit() {
    vscode.postMessage({
      command: "edit",
      text: reqeustData.json,
    });
  }

  function onExport() {
    console.log(`export triggered`);
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
  reqeustData="{reqeustData}"
  onSend="{onSend}"
  onExport="{onExport}"
  onHost="{onHost}"
/>

<table>
  <td>
    <Request bind:reqeustData edit="{onEdit}" />
  </td>

  <td>
    <Response bind:reqeustData />
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
