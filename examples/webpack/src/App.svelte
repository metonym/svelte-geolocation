<script>
  import Geolocation from "svelte-geolocation";

  let coords = [];
</script>

<Geolocation getPosition bind:coords />

<pre>{JSON.stringify(coords)}</pre>
