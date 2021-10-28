<script lang="ts">
  import Geolocation from "../types";
  import {
    GeolocationProps,
    GeolocationCoords,
  } from "../types/Geolocation.svelte";
  import Geolocation2 from "../types/Geolocation.svelte";

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

<!-- svelte-ignore missing-declaration -->
<Geolocation getPosition="{getPosition}" bind:position />

<!-- svelte-ignore missing-declaration -->
<Geolocation
  {...props}
  getPosition="{getPosition}"
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
  on:click="{() => {
    getPosition = true;
  }}">Get geolocation</button
>

<!-- svelte-ignore missing-declaration -->
<Geolocation
  bind:this="{ref}"
  getPosition
  watch="{false}"
  on:position="{(e) => {
    console.log(e.detail); // GeolocationPosition
  }}"
  on:error="{(e) => {
    console.log(e.detail); // GeolocationError
  }}"
/>

<!-- svelte-ignore missing-declaration -->
<Geolocation getPosition options="{options}" />

<!-- svelte-ignore missing-declaration -->
<Geolocation2 />
