/// <reference types="svelte" />
import { SvelteComponentTyped } from "svelte";

export type GeolocationError = false | GeolocationPositionError;

export type GeolocationCoords = [number, number];

export interface GeolocationProps {
  /**
   * [Longitude, Latitude]
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
   * Set to `true` to enable `geolocation` API. If `watch`
   * is false, then `geolocation.getCurrentLocation` is used.
   * @default false
   */
  getPosition?: boolean;

  /** Set to `true` to enable `geolocation.watchPosition`
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

export default class Geolocation extends SvelteComponentTyped<
  GeolocationProps,
  {
    position: CustomEvent<GeolocationPosition>;
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
> {}
