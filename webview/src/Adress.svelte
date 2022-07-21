<script>
  export let adresses = [];
  export let adress = "";
  $: adress = adress;
</script>

<div class="row">
  <th>adress: </th>
  <div class="elem">
    <input type="text" />
  </div>
  <div class="elem">
    <button> pick </button>
  </div>
  <div class="elem">
    <button>tls</button>
  </div>
</div>

<style>
  .row {
    width: 100%;
    display: table;
  }
  .elem {
    display: table-cell;
    margin-left: 4px;
    margin-right: 4px;
  }
</style>
