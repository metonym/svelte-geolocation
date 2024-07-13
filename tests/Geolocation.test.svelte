<script lang="ts">
  import Geolocation from "svelte-geolocation";
  import type {
    GeolocationProps,
    GeolocationCoords,
  } from "svelte-geolocation/Geolocation.svelte";

  let props: GeolocationProps = {
    watch: true,
  };
  let ref: Geolocation;
  let getPosition = false;
  let position = {};
  let coords: GeolocationCoords = [-1, -1];

  let options = {
    enableHighAccuracy: true,
    timeout: 5000, // milliseconds
    maximumAge: 60 * 60 * 1000, // milliseconds
  };

  $: if (ref) ref.getGeolocationPosition({});
  $: if (ref) ref.watchPosition({});
</script>

<Geolocation {getPosition} bind:position />

<Geolocation
  {...props}
  {getPosition}
  bind:coords
  let:loading
  let:success
  let:error
  let:notSupported
>
  {#if notSupported}
    Your browser does not support the Geolocation API.
  {:else}
    {#if loading}Loading...{/if}
    {#if success}{JSON.stringify(coords)}{/if}
    {#if error}An error occurred. {error.code} {error.message}{/if}
  {/if}
</Geolocation>

<button
  type="button"
  on:click={() => {
    getPosition = true;
  }}>Get geolocation</button
>

<Geolocation
  bind:this={ref}
  getPosition
  watch={false}
  on:position={(e) => {
    console.log(e.detail?.coords?.accuracy); // GeolocationPosition
  }}
  on:error={(e) => {
    console.log(e.detail); // GeolocationError
  }}
/>

<Geolocation getPosition {options} />
