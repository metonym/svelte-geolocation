<script>
  // @ts-check
  /**
   * @typedef {false | GeolocationPositionError} GeolocationError
   * @typedef {[longitude: number, latitude: number]} GeolocationCoords
   */

  /**
   * Obtain the geolocation coordinates ([longitude, latitude])
   * @type {GeolocationCoords}
   */
  export let coords = [-1, -1];

  /** @type {Partial<GeolocationPosition>} */
  export let position = {};

  /** @type {PositionOptions} */
  export let options = {};

  /**
   * Set to `true` to automatically trigger the `geolocation` API.
   * If `watch` is false, then the `geolocation.getCurrentLocation` accessor must be called.
   */
  export let getPosition = false;

  /** Set to `true` to enable `geolocation.watchPosition` */
  export let watch = false;

  /** `true` when the position is being fetched */
  export let loading = false;

  /** `true` when the position is fetched */
  export let success = false;

  /**
   * An error code/message is set if an error occurs
   * @type {GeolocationError}
   */
  export let error = false;

  /** `true` if the browser does not support the Geolocation API */
  export let notSupported = false;

  /**
   * Watch the geolocation position.
   * @type {(options: PositionOptions) => undefined | number}
   */
  export function watchPosition(opts) {
    notSupported = false;
    loading = true;
    error = false;

    if (!("geolocation" in navigator)) {
      notSupported = true;
    } else {
      if (watcherId) clearWatcher(watcherId);

      watcherId = navigator.geolocation.watchPosition(
        handlePosition,
        handleError,
        opts,
      );

      return watcherId;
    }
  }

  /**
   * Programmatically get the geolocation position.
   * @type {(options: PositionOptions) => Promise<void>}
   */
  export async function getGeolocationPosition(opts) {
    notSupported = false;
    loading = true;
    error = false;

    if (!("geolocation" in navigator)) {
      notSupported = true;
    } else {
      navigator.geolocation.getCurrentPosition(
        handlePosition,
        handleError,
        opts,
      );
    }
  }

  /**
   * Clear the Geolocation watcher
   * @type {(watcherId: number) => void}
   */
  export function clearWatcher(id) {
    if (!("geolocation" in navigator)) {
      notSupported = true;
    } else {
      navigator.geolocation.clearWatch(id);
      watcherId = undefined;
    }
  }

  import { createEventDispatcher, onMount } from "svelte";

  /**
   * @type {import("svelte").EventDispatcher<{ position: Partial<GeolocationPosition>; error: GeolocationError; }>}
   */
  const dispatch = createEventDispatcher();

  /** @type {number | undefined} */
  let watcherId = undefined;

  /** @type {GeolocationPosition | undefined} */
  let lastPosition = undefined;

  /** @type {(position: GeolocationPosition) => void} */
  function handlePosition(pos) {
    coords = [pos.coords.longitude, pos.coords.latitude];
    position = {
      coords: {
        accuracy: pos.coords.accuracy,
        altitude: pos.coords.altitude,
        altitudeAccuracy: pos.coords.altitudeAccuracy,
        heading: pos.coords.heading,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        speed: pos.coords.speed,
      },
      timestamp: pos.timestamp,
    };

    if (
      !lastPosition ||
      lastPosition.coords.latitude !== pos.coords.latitude ||
      lastPosition.coords.longitude !== pos.coords.longitude
    ) {
      lastPosition = pos;
      dispatch("position", position);
    }
    loading = false;
  }

  /** @type {(error: GeolocationError) => void} */
  function handleError(geolocationError) {
    dispatch("error", geolocationError);
    error = geolocationError;
    loading = false;
  }

  onMount(() => {
    return () => {
      if (watcherId) clearWatcher(watcherId);
    };
  });

  $: if (typeof window !== "undefined" && getPosition && watch) {
    watchPosition(options);
  }
  $: if (typeof window !== "undefined" && getPosition && !watch) {
    getGeolocationPosition(options);
  }

  $: success = getPosition && !loading && !error;
  $: if ((!getPosition || !watch) && watcherId) clearWatcher(watcherId);
</script>

<slot {loading} {success} {error} {notSupported} {coords} />
