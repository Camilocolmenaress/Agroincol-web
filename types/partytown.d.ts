declare module '@builder.io/partytown/react' {
  import { ComponentPropsWithoutRef } from 'react';

  interface PartytownProps {
    debug?: boolean;
    forward?: string[];
    resolveUrl?: (url: URL, location: URL) => URL | undefined | null;
  }

  export function Partytown(props: PartytownProps): JSX.Element;
}

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}
