<script>
  import JsonArea from "./JsonArea.svelte";
  export let data;
  $: innerHeight = 0;
</script>

<svelte:window bind:innerHeight />

<table>
  <tr>
    <center>
      <div>Request type: {data.inputMessageName}</div>
    </center>
  </tr>
  <tr>
    <JsonArea bind:text="{data.json}" height="{innerHeight - 180}" />
  </tr>
</table>

<style>
  table {
    width: 100%;
  }
  tr {
    width: 100%;
  }
  center {
    padding-top: 2px;
    padding-bottom: 5px;
  }
</style>
