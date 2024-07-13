import { SvelteComponentTyped } from "svelte";

export type GeolocationError = false | GeolocationPositionError;

export type GeolocationCoords = [longitude: number, latitude: number];

export interface GeolocationProps {
  /**
   * Obtain the geolocation coordinates ([longitude, latitude])
   * @default [-1, -1]
   */
  coords?: GeolocationCoords;

  /**
   * @default {}
   */
  position?: Partial<GeolocationPosition>;

  /**
   * @default {}
   */
  options?: PositionOptions;

  /**
   * Set to `true` to automatically trigger the `geolocation` API.
   * If `watch` is false, then the `geolocation.getCurrentLocation` accessor must be called.
   * @default false
   */
  getPosition?: boolean;

  /**
   * Set to `true` to enable `geolocation.watchPosition`
   * @default false
   */
  watch?: boolean;

  /**
   * `true` when the position is being fetched
   * @default false
   */
  loading?: boolean;

  /**
   * `true` when the position is fetched
   * @default false
   */
  success?: boolean;

  /**
   * An error code/message is set if an error occurs
   * @default false
   */
  error?: GeolocationError;

  /**
   * `true` if the browser does not support the Geolocation API
   * @default false
   */
  notSupported?: boolean;
}

export default class extends SvelteComponentTyped<
  GeolocationProps,
  {
    position: CustomEvent<GeolocationProps["position"]>;
    error: CustomEvent<GeolocationError>;
  },
  {
    default: {
      loading: boolean;
      success: boolean;
      error: GeolocationError;
      notSupported: boolean;
      coords: GeolocationCoords;
    };
  }
> {
  /** Watch the geolocation position. */
  watchPosition: (options: PositionOptions) => undefined | number;

  /** Programmatically get the geolocation position. */
  getGeolocationPosition: (options: PositionOptions) => Promise<void>;

  /** Clear the Geolocation watcher. */
  clearWatcher: (watcherId: number) => void;
}
