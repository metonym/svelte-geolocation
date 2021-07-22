<script>
  /**
   * @typedef {false | GeolocationPositionError} GeolocationError
   * @typedef {[longitude: number, latitude: number]} GeolocationCoords
   * @event {GeolocationPosition} position
   * @event {GeolocationError} error
   * @slot {{
   *  loading: boolean;
   *  success: boolean;
   *  error: GeolocationError;
   *  notSupported: boolean;
   *  coords: GeolocationCoords
   * }}
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
   * Set to `true` to enable `geolocation` API.
   * If `watch` is false, then `geolocation.getCurrentLocation` is used.
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
   * Watch the geolocation position
   * @type {(options: PositionOptions) => Promise<Number | undefined>}
   */
  export async function watchPosition(opts) {
    notSupported = false;
    loading = true;
    error = false;

    if (!("geolocation" in navigator)) {
      notSupported = true;
    } else {
      if (watcherId) await clearWatcher(watcherId);

      watcherId = navigator.geolocation.watchPosition(
        handlePosition,
        handleError,
        opts
      );

      return watcherId;
    }
  }

  /**
   * Invoke the `geolocation.getCurrentPosition` method
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
        opts
      );
    }
  }

  /**
   * Clear the Geolocation watcher
   * @type {(watcherId: number) => Promise<void>}
   */
  export async function clearWatcher(watcherId) {
    if (!("geolocation" in navigator)) {
      notSupported = true;
    } else {
      navigator.geolocation.clearWatch(watcherId);
      watcherId = undefined;
    }
  }

  import { createEventDispatcher, onDestroy } from "svelte";

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

  /** @type {(error: GeolocationError) => void;} */
  function handleError(err) {
    dispatch("error", err);
    error = err;
    loading = false;
  }

  onDestroy(() => {
    if (watcherId) clearWatcher(watcherId);
  });

  $: if (getPosition && watch) watchPosition(options);
  $: if (getPosition && !watch) getGeolocationPosition(options);
  $: success = getPosition && !loading && !error;
  $: if ((!getPosition || !watch) && watcherId) clearWatcher(watcherId);
</script>

<slot
  loading="{loading}"
  success="{success}"
  error="{error}"
  notSupported="{notSupported}"
  coords="{coords}"
/>
