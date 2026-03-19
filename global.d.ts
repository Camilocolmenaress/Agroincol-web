/* eslint-disable no-var */
export {};

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}
