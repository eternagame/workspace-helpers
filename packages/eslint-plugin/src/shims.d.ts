declare module 'eslint-config-airbnb-base/rules/style' {
  interface AirBnbBaseStyle {
    rules: {
      'no-restricted-syntax': (
        | string
        | { selector: string; message: string }
      )[];
    };
  }

  declare const style: AirBnbBaseStyle;
  export = style;
}

interface AirBnbImportsConfig {
  rules: {
    'import/no-extraneous-dependencies': [
      string,
      {
        devDependencies: string[] | boolean;
        optionalDependencies: string[] | boolean;
      }
    ];
  };
}

declare module 'eslint-config-airbnb-typescript/lib/shared' {}

declare module 'eslint-config-airbnb-base/rules/imports' {}
