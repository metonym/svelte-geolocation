# svelte-geolocation

[![NPM][npm]][npm-url]

> [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) wrapper for Svelte.

<!-- REPO_URL -->

**Features**

- loading/error/success states
- access coordinates in a 2-tuple (`[longtitude: number, latitude: number]`)

---

<!-- TOC -->

## Installation

**Yarn**

```bash
yarn add -D svelte-geolocation
```

**NPM**

```bash
npm i -D svelte-geolocation
```

## Usage

### Binding coordinates

Set `getPosition` to `true` to invoke the `geolocation.getCurrentPosition` method and bind to the `coords` prop to retrieve the `[longitude, latitude]` of the device. The default `coords` value is `[-1, -1]`.

```svelte
<script>
  import Geolocation from "svelte-geolocation";

  let coords = [];
</script>

<Geolocation getPosition bind:coords />

<pre>{JSON.stringify(coords)}</pre>

```

### Binding geolocation position

Bind to `position` to access all properties from [GeolocationPosition](https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPosition).

```svelte
<script>
  let position;
</script>

<Geolocation getPosition bind:position />

<pre>{JSON.stringify(position, null, 2)}</pre>

```

### Controlled trigger + default slot

This example shows the controlled invocation of `geolocation.getCurrentPosition`.

Using the default slot, you can destructure the following props:

- **`coords`**: geolocation coordinates in `[lng, lat]` format
- **`loading`**: `true` when the geolocation is being fetched
- **`success`**: `true` if the geolocation has been obtained
- **`error`**: `true` if an error occurs when fetching the geolocation
- **`notSupported`**: `true` if the device does not support the Geolocation API

```svelte
<script>
  let getPosition = false;
</script>

<button on:click="{() => (getPosition = true)}"> Get geolocation </button>

<Geolocation
  getPosition="{getPosition}"
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

### Watching Position

Set `watch` to `true` to invoke the `geolocation.watchPosition` method and get informed if the user changes position.

```svelte
<script>
  let getPositionAgain = false;
  let detail = {};
</script>

<button on:click="{() => (getPositionAgain = !getPositionAgain)}">
  Get Position
</button>

<Geolocation
  getPosition="{getPositionAgain}"
  watch="{true}"
  on:position="{(e) => {
    detail = e.detail;
  }}"
/>

<pre>{JSON.stringify(detail, null, 2)}</pre>

```

### Dispatched Events

You can listen to dispatched events as an alternative to binding.

- **`on:position`**: fired when `geolocation.getCurrentPosition` succeeds
- **`on:error`**: fired when `geolocation.getCurrentPosition` fails

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

### Geolocation options

Specify [Geolocation position options](https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions) using the `options` prop.

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

## API

### Props

| Prop name    | Value                                                                                                                              |
| :----------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| coords       | `[longitude: number, latitude: number];` (default: `[-1, -1]`)                                                                     |
| position     | [GeolocationPosition](https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPosition)                                        |
| options      | [PositionOptions](https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions)                                                |
| getPosition  | `boolean` (default: `false`)                                                                                                       |
| watch        | `boolean` (default: `false`)                                                                                                       |
| loading      | `boolean` (default: `false`)                                                                                                       |
| success      | `boolean` (default: `false`)                                                                                                       |
| error        | `false` or [GeolocationPositionError](https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPositionError) (default:`false`) |
| notSupported | `boolean` (default: `false`)                                                                                                       |

### Accessors

Use the `bind:this` directive to access the accessor methods available on the component instance.

```svelte
<script>
  let geolocation;

  $: if (geolocation) {
    geolocation.getGeolocationPosition({ enableHighAccuracy: true });
  }
</script>

<Geolocation bind:this="{geolocation}" />

```

```ts
interface Accessors {
  /** Watch the geolocation position */
  watchPosition: (options: PositionOptions) => Promise<Number | undefined>;

  /** Invoke the geolocation.getCurrentPosition method */
  getGeolocationPosition: (options: PositionOptions) => Promise<void>;

  /** Clear the Geolocation watcher */
  clearWatcher: (watcherId: number) => Promise<void>;
}
```

## TypeScript

Svelte version 3.31 or greater is required to use this module with TypeScript.

TypeScript definitions are located in the [types folder](./types).

## Changelog

[CHANGELOG.md](CHANGELOG.md)

## License

[MIT](LICENSE)

[npm]: https://img.shields.io/npm/v/svelte-geolocation.svg?style=for-the-badge&color=%23ff3e00
[npm-url]: https://npmjs.com/package/svelte-geolocation
