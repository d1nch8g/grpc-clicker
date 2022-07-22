<script>
  import TopPanel from "./TopPanel.svelte";
  import Request from "./Request.svelte";
  import Response from "./Response.svelte";
</script>

<div class="top-container">
  <TopPanel />
</div>

<table>
  <td class="left">
    <Request />
  </td>

  <td>
    <Response />
  </td>
</table>

<style>
  .top-container {
    padding-top: 2%;
    padding-left: 6%;
    padding-right: 6%;
  }

  table {
    width: 100%;
  }

  td,
  tr {
    height: 100%;
    width: 50%;
  }

  td.left {
    border-right: 1px solid;
  }
</style>
