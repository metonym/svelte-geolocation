# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0](https://github.com/metonym/svelte-geolocation/releases/tag/v0.4.0) - 2024-07-13

**Breaking Changes**

- add exports map and use `type: module`
- drop bundled ESM/UMD support

**Fixes**

- fix TypeScript definitions to reflect that `watchPosition`, `clearWatcher` accessors are not async

## [0.3.0](https://github.com/metonym/svelte-geolocation/releases/tag/v0.3.0) - 2021-10-27

- use `.svelte.d.ts` extension for TypeScript definitions
- add component imports to examples in `README.md`

## [0.2.3](https://github.com/metonym/svelte-geolocation/releases/tag/v0.2.3) - 2021-09-28

- guard against `window` is undefined to support SSR environments, like SvelteKit

## [0.2.2](https://github.com/metonym/svelte-geolocation/releases/tag/v0.2.2) - 2021-07-22

- add `watchPosition`, `getGeolocationPosition`, `clearWatcher` as accessor methods in the TypeScript definitions

## [0.2.1](https://github.com/metonym/svelte-geolocation/releases/tag/v0.2.1) - 2021-02-06

- clear watcher in `watchPosition` method

## [0.2.0](https://github.com/metonym/svelte-geolocation/releases/tag/v0.2.0) - 2021-02-01

- set `watch` to `true` to enable the `geolocation.watchPosition` API
- export `getGeolocationPosition`, `watchPosition`, `clearWatcher` functions

## [0.1.0](https://github.com/metonym/svelte-geolocation/releases/tag/v0.1.0) - 2020-12-30

- Initial release
