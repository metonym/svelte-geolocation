# svelte-geolocation

[![NPM][npm]][npm-url]

> Svelte bindings for the [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)

Declaratively access the Geolocation API in Svelte components. This package provides a simple way to fetch the geolocation coordinates of the device.

**Features**

- Bind to coordinates in a 2-tuple (`[longtitude: number, latitude: number]`).
- Slotted states: loading/error/success.
- Programmatic access to the Geolocation API (e.g., `geolocation.getCurrentPosition`).
- Watch the current position.

---

<!-- TOC -->

## Installation

```bash
# npm
npm i -D svelte-geolocation

# pnpm
pnpm i -D svelte-geolocation

# Bun
bun i -D svelte-geolocation

# Yarn
yarn add -D svelte-geolocation
```

### Known Issues

Some users have reported an error like the following when simply
importing `svelte-geolocation`:

```code
2:39:10 PM [vite] Error when evaluating SSR module /src/routes/+page.svelte: failed to import "svelte-geolocation"
|- TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".svelte" for /projects/my-project/node_modules/svelte-geolocation/Geolocation.svelte
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:160:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:203:36)
    at defaultLoad (node:internal/modules/esm/load:143:22)
    at async ModuleLoader.load (node:internal/modules/esm/loader:396:7)
    at async ModuleLoader.moduleProvider (node:internal/modules/esm/loader:278:45)
```

To remedy this, one solution is to add `"svelte-geolocation"` to the
`optimizeDeps.exclude` array of your `vite` config (e.g. `vite.config.js`). For example:

```js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  },
  optimizeDeps: {
    exclude: ['svelte-geolocation']
  }
});
```

See [here](https://vitejs.dev/config/dep-optimization-options.html#optimizedeps-exclude)
for vitest's docs on `optimizeDeps.exclude`, and
[here](https://vitejs.dev/guide/dep-pre-bundling.html) for more on the
"why" of dependency optimization.

## Usage

### Binding coordinates

Set `getPosition` to `true` to automatically invoke the `geolocation.getCurrentPosition` method and bind to the `coords` prop to retrieve the `[longitude, latitude]` of the device. The default `coords` value is `[-1, -1]`.

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
  import Geolocation from "svelte-geolocation";

  let position;
</script>

<Geolocation getPosition bind:position />

<pre>{JSON.stringify(position, null, 2)}</pre>
```

### Programmatic usage

By default, the component will not automatically fetch the geolocation coordinates. This method must be programmatically triggered.

```svelte no-eval
<script>
  let ref;

  // Access the component instance and programmatically invoke the method.
  $: ref?.getGeolocationPosition({ enableHighAccuracy: true });
</script>

<Geolocation bind:this={ref} />
```

### Slotted states

This example shows programmatic usage of `geolocation.getCurrentPosition`.

Using the default slot, you can destructure the following props:

- **`coords`**: geolocation coordinates in `[lng, lat]` format
- **`loading`**: `true` when the geolocation is being fetched
- **`success`**: `true` if the geolocation has been obtained
- **`error`**: `true` if an error occurs when fetching the geolocation
- **`notSupported`**: `true` if the device does not support the Geolocation API

```svelte
<script>
  import Geolocation from "svelte-geolocation";

  let getPosition = false;
</script>

<button on:click={() => (getPosition = true)}> Get geolocation </button>

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

### Watching Position

Set `watch` to `true` to invoke the `geolocation.watchPosition` method and get informed if the user changes position.

```svelte
<script>
  import Geolocation from "svelte-geolocation";

  let getPositionAgain = false;
  let detail = {};
</script>

<button on:click={() => (getPositionAgain = !getPositionAgain)}>
  Get Position
</button>

<Geolocation
  getPosition={getPositionAgain}
  watch={true}
  on:position={(e) => {
    detail = e.detail;
  }}
/>

<pre>{JSON.stringify(detail, null, 2)}</pre>
```

### Dispatched Events

You can listen to dispatched events as an alternative to binding.

- **`on:position`**: fired when `geolocation.getCurrentPosition` succeeds
- **`on:error`**: fired when `geolocation.getCurrentPosition` fails

```svelte
<script>
  import Geolocation from "svelte-geolocation";

  let events = [];
</script>

<Geolocation
  getPosition
  on:position={(e) => {
    events = [...events, e.detail];
    console.log(e.detail); // GeolocationPosition
  }}
  on:error={(e) => {
    events = [...events, e.detail];
    console.log(e.detail); // GeolocationError
  }}
/>

<strong>Dispatched events:</strong>

{#each events as event}
  <pre>{JSON.stringify(event, null, 2)}</pre>
{/each}
```

### Geolocation options

Specify [Geolocation position options](https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions) using the `options` prop.

```svelte no-eval
<script>
  import Geolocation from "svelte-geolocation";

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

```svelte no-display
<script>
  import Geolocation from "svelte-geolocation";

  let geolocation;

  $: geolocation?.getGeolocationPosition({ enableHighAccuracy: true });
</script>

<Geolocation bind:this={geolocation} />
```

#### API

```ts
interface Accessors {
  /** Watch the geolocation position. */
  watchPosition: (options: PositionOptions) => undefined | number;

  /** Programmatically get the geolocation position. */
  getGeolocationPosition: (options: PositionOptions) => Promise<void>;

  /** Clear the Geolocation watcher. */
  clearWatcher: (watcherId: number) => void;
}
```

## Examples

- [examples/sveltekit](examples/sveltekit)
- [examples/vite](examples/vite)
- [examples/rollup](examples/rollup)
- [examples/webpack](examples/webpack)

## Changelog

[CHANGELOG.md](CHANGELOG.md)

## License

[MIT](LICENSE)

[npm]: https://img.shields.io/npm/v/svelte-geolocation.svg?style=for-the-badge&color=%23ff3e00
[npm-url]: https://npmjs.com/package/svelte-geolocation
