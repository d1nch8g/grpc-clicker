<script>
  import Adress from "./Adress.svelte";
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
      <Adress adress="{adress}" adresses="{adresses}" />
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
    margin: 4px;
  }
  .expanded {
    width: 100%;
  }
</style>
