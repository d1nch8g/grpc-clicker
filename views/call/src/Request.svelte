<script>
  import JsonArea from "./JsonArea.svelte";
  export let height;
  export let data;
</script>

<table>
  <tr>
    <center>
      <div>Request type: {data.info.inputMessageName}</div>
    </center>
  </tr>
  <tr>
    <JsonArea bind:text={data.request.content} {height} />
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
