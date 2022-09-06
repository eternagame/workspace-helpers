declare module 'create-polyfill-service-url/src/index.js' {
  export const TYPE_NOTHING: symbol;
  export const TYPE_URL: symbol;

  export default function generatePolyfillURL(
    features: string[],
    browsers: string[]
  ): Promise<{
    type: TYPE_NOTHING | TYPE_URL;
    message: string;
  }>;
}

declare module '@financial-times/js-features-analyser/src/index.js' {}
