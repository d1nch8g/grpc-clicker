<script>
  import JsonArea from "./JsonArea.svelte";
  export let data;
  export let height;
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
      <JsonArea
        bind:text="{data.response.content}"
        height="{height}"
        editable="{false}"
      />
    {:else}
      <JsonArea
        bind:text="{data.response.content}"
        height="{height}"
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
