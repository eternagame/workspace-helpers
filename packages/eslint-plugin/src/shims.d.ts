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
      },
    ];
  };
}

interface AirBnbStyleConfig {
  rules: {
    '@typescript-eslint/indent': [
      string,
      number,
      {
        ignoredNodes: string[]
      },
    ]
  }
}

declare module 'eslint-config-airbnb-typescript/lib/shared' {
  type FullConfig = AirBnbImportsConfig & AirBnbStyleConfig;
  export = {} as FullConfig;
}

declare module 'eslint-config-airbnb-base/rules/imports' {
  export = {} as AirBnbImportsConfig;
}
