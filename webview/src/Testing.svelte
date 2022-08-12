<script>
  export let requestData;
  export let editResponse;
  export let editCode;
  export let editTime;
  $: innerHeight = 0;
  $: height = innerHeight - 270;
  let codes = [
    `OK`,
    `Cancelled`,
    `Unknown`,
    `InvalidArgument`,
    `DeadlineExceeded`,
    `NotFound`,
    `AlreadyExists`,
    `PermissionDenied`,
    `ResourceExhausted`,
    `FailedPrecondition`,
    `Aborted`,
    `OutOfRange`,
    `Unimplemented`,
    `Internal`,
    `Unavailable`,
    `DataLoss`,
    `Unauthenticated`,
  ];
</script>

<svelte:window bind:innerHeight />

<div class="content">
  <center>
    <vscode-option>Test: {requestData.inputMessageName}</vscode-option>
  </center>
  <table>
    <tr> </tr>
  </table>
</div>

<style>
</style>
