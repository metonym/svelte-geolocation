<script>
  /**
   * @typedef {false | GeolocationPositionError} GeolocationError
   * @typedef {[number, number]} GeolocationCoords
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
   * [Longitude, Latitude]
   * @type {GeolocationCoords}
   */
  export let coords = [-1, -1];

  /** @type {Partial<GeolocationPosition>} */
  export let position = {};

  /** @type {PositionOptions} */
  export let options = {};

  /** Set to `true` to invoke `geolocation.getCurrentPosition` */
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

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let watcherId = undefined;
  let lastPosition = undefined;
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

    if (!lastPosition || (lastPosition.coords.latitude !== pos.coords.latitude || lastPosition.coords.longitude !== pos.coords.longitude)) {
      lastPosition = pos;
      dispatch("position", position);
    }
    loading = false;
  }

  function handleError(err) {
    dispatch("error", err);
    error = err;
    loading = false;
  }

  async function getGeolocationPosition(opts) {
    notSupported = false;
    loading = true;
    error = false;

    if (!("geolocation" in navigator)) {
      notSupported = true;
    } else if (watch) {
      watcherId = watcherId ? watcherId : navigator.geolocation.watchPosition(handlePosition, handleError, opts);
    } else {
      navigator.geolocation.getCurrentPosition(handlePosition, handleError, opts);
    }
  }

  async function clearWatcher(watcherId) {
    if (!("geolocation" in navigator)) {
      notSupported = true;
    } else {
      navigator.geolocation.clearWatch(watcherId);
    }
  }

  $: if (getPosition) getGeolocationPosition(options);
  $: success = getPosition && !loading && !error;
  $: if (!watch && watcherId) clearWatcher(watcherId);
</script>

<slot loading="{loading}" success="{success}" error="{error}" notSupported="{notSupported}" coords="{coords}" />
