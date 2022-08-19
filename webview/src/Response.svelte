<script>
  import JsonArea from "./JsonArea.svelte";
  export let data;
  $: innerHeight = 0;
</script>

<svelte:window bind:innerHeight />

<table>
  <tr>
    <center>
      {#if data.time === 0}
        <div>Response: {data.outputMessageName}</div>
      {:else}
        <div>{data.code} - {data.time}</div>
      {/if}
    </center>
  </tr>
  <tr>
    {#if data.code !== `OK`}
      <JsonArea
        bind:text="{data.response}"
        height="{innerHeight - 180}"
        highlight="{false}"
      />
    {:else}
      <JsonArea bind:text="{data.response}" height="{innerHeight - 180}" />
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
