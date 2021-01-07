# svelte-geolocation

[![NPM][npm]][npm-url]

> [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) wrapper for Svelte.

**Features**

- loading/error/success states
- access coordinates in a tuple (`[Longtitude, Latitude]`)

<!-- REPO_URL -->

---

<!-- TOC -->

## Install

```bash
yarn add -D svelte-geolocation
# OR
npm i -D svelte-geolocation
```

## Usage

### Binding coordinates

Set `getPosition` to `true` to invoke the `geolocation.getCurrentPosition` method and bind to the `coords` prop to retrieve the `[lng, lat]` of the device. The default `coords` value is `[-1, -1]`.

<!-- prettier-ignore-start -->
```svelte
<script>
  import Geolocation from "svelte-geolocation";

  let coords;
</script>

<Geolocation getPosition bind:coords />

<pre>{JSON.stringify(coords)}</pre>
```
<!-- prettier-ignore-end -->

### Binding geolocation position

Bind to `position` to access all properties from [GeolocationPosition](https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPosition).

<!-- prettier-ignore-start -->
```svelte
<script>
  let position;
</script>

<Geolocation getPosition bind:position />

<pre>{JSON.stringify(position, null, 2)}</pre>
```
<!-- prettier-ignore-end -->

### Controlled trigger + default slot

This example shows the controlled invocation of `geolocation.getCurrentPosition`.

Using the default slot, you can destructure the following props:

- **`coords`**: geolocation coordinates in `[lng, lat]` format
- **`loading`**: `true` when the geolocation is being fetched
- **`success`**: `true` if the geolocation has been obtained
- **`error`**: `true` if an error occurs when fetching the geolocation
- **`notSupported`**: `true` if the device does not support the Geolocation API

<!-- prettier-ignore-start -->
```svelte
<script>
  let getPosition = false;
</script>

<button type="button" on:click={() => (getPosition = true)}>Get geolocation</button>

<br />

<Geolocation
  {getPosition}
  let:coords
  let:loading
  let:success
  let:error
  let:notSupported
>
  {#if notSupported}
    Your browser does not support the Geolocation API.
  {:else}
    {#if loading}
      Loading...
    {/if}
    {#if success}
      {JSON.stringify(coords)}
    {/if}
    {#if error}
      An error occurred. {error.code} {error.message}
    {/if}
  {/if}
</Geolocation>
```
<!-- prettier-ignore-end -->

### Dispatched Events

You can listen to dispatched events as an alternative to binding.

- **`on:position`**: fired when `geolocation.getCurrentPosition` succeeds
- **`on:error`**: fired when `geolocation.getCurrentPosition` fails

<!-- prettier-ignore-start -->
```svelte
<script>
  let events = [];
</script>

<Geolocation
  getPosition
  on:position="{(e) => {
    events = [...events, e.detail];
    console.log(e.detail); // GeolocationPosition
  }}"
  on:error="{(e) => {
    events = [...events, e.detail];
    console.log(e.detail); // GeolocationError
  }}"
/>

<strong>Dispatched events:</strong>

<ul>
  {#each events as event}
    <li>
      <pre>{JSON.stringify(event, null, 2)}</pre>
    </li>
  {/each}
</ul>

```
<!-- prettier-ignore-end -->

### Geolocation options

Specify [Geolocation position options](https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions) using the `options` prop.

<!-- prettier-ignore-start -->
```html
<script>
  let options = {
    /**
     * @type {boolean}
     * @default false
     */
    enableHighAccuracy: true,

    /**
     * @type {number}
     * @default Infinity
     */
    timeout: 5000, // milliseconds

    /**
     * @type {number}
     * @default 0
     */
    maximumAge: 60 * 60 * 1000, // milliseconds
  };
</script>

<Geolocation getPosition {options} />
```
<!-- prettier-ignore-end -->

## API

### Props

| Prop name    | Value                                                                                                                              |
| :----------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| coords       | `[Longitude, Latitude]` (default: `[-1, -1]`)                                                                                      |
| position     | [GeolocationPosition](https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPosition)                                        |
| options      | [PositionOptions](https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions)                                                |
| getPosition  | `boolean` (default: `false`)                                                                                                       |
| loading      | `boolean` (default: `false`)                                                                                                       |
| success      | `boolean` (default: `false`)                                                                                                       |
| error        | `false` or [GeolocationPositionError](https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPositionError) (default:`false`) |
| notSupported | `boolean` (default: `false`)                                                                                                       |

## TypeScript

Svelte version 3.31 or greater is required to use this module with TypeScript.

## Changelog

[CHANGELOG.md](CHANGELOG.md)

## License

[MIT](LICENSE)

[npm]: https://img.shields.io/npm/v/svelte-geolocation.svg?style=for-the-badge&color=%23ff3e00
[npm-url]: https://npmjs.com/package/svelte-geolocation
