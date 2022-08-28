<script>
  import JsonArea from "./JsonArea.svelte";
  export let data;
  console.log(data.response);
</script>

<table>
  <tr>
    <center>
      {#if data.response.content === ``}
        <div>Response: {data.info.outputMessageName}</div>
      {:else}
        <div>{data.response.code} - {data.response.time}</div>
      {/if}
    </center>
  </tr>
  <tr>
    {#if data.response.code === `OK`}
      <JsonArea bind:text="{data.response.content}" editable="{false}" />
    {:else}
      <JsonArea
        bind:text="{data.response.content}"
        highlight="{false}"
        editable="{false}"
      />
    {/if}
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
