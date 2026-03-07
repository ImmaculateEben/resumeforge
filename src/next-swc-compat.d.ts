// Fix for missing type declarations when using WASM SWC bindings.
// These are auto-generated .next/types paths that lack .d.ts files.

declare module "next/dist/lib/metadata/types/metadata-interface.js" {
  export type ResolvingMetadata = any;
  export type ResolvingViewport = any;
}

declare module "next/dist/build/segment-config/app/app-segment-config.js" {
  export type PrefetchForTypeCheckInternal = any;
}

declare module "next/server.js" {
  export { NextRequest, NextResponse } from "next/server";
}

declare module "next/types.js" {
  export type ResolvingMetadata = any;
  export type ResolvingViewport = any;
}
