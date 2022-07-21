<script>
  export let proto = "petstore";
  export let version = "v1";
  export let service = "petstore";
  export let call = "call";

  export let adresses = [];
  export let adress = "adress";
  $: adress = adress;
</script>

<table>
  <tr>
    <th>proto</th>
    <td>{proto}</td>
    <th>service</th>
    <td>{service}</td>
    <td class="expanded">
      <input type="text" name="" id="" />
    </td>
  </tr>
  <tr>
    <th>version</th>
    <td>{version}</td>
    <th>call</th>
    <td>{call}</td>
    <td>
      <center> <button>SEND</button></center>
    </td>
  </tr>
</table>

<style>
  table {
    padding-top: 16px;
    padding-left: 82px;
    padding-right: 82px;
    margin: 4px;
    border: 1px solid;
    border-collapse: collapse;
  }
  td,
  th {
    margin: 6px;
    padding: 6px;
    border: 1px solid;
    border-collapse: collapse;
  }
  .expanded {
    width: 100%;
  }
</style>
