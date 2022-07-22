<script>
  $: innerHeight = 0;
  $: height = innerHeight - 220;
</script>

<svelte:window bind:innerHeight />
<div>
  <center>
    <p1>REQUEST</p1>
  </center>

  <textarea name="" id="" cols="30" rows="10" style="--height: {height}px"
  ></textarea>
</div>

<style>
  p1 {
    padding: 3%;
  }
  div {
    padding-right: 5%;
  }
  textarea {
    resize: none;
    margin: 20px;
    height: var(--height);
    margin-left: 10px;
  }
</style>
