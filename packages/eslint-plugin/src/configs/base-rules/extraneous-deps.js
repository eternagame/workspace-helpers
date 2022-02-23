module.exports = function noExtraneousDependencies(ignoreDev, isTypescript) {
  // We need to do this dynamically to allow eslint-config-airbnb-typescript to be optional
  /* eslint-disable global-require */
  const base = isTypescript
    ? require('eslint-config-airbnb-typescript/lib/shared')
    : require('eslint-config-airbnb-base/rules/imports');
  /* eslint-enable global-require */

  return {
    'import/no-extraneous-dependencies': [
      base.rules['import/no-extraneous-dependencies'][0],
      {
        ...base.rules['import/no-extraneous-dependencies'][1],
        // Some files, such as tests and configs, allow for imports to be placed in dev dependencies
        // by default. We want to blanket allow this behavior for files outside our nx packages
        ...(ignoreDev ? { devDependencies: true } : {}),
      },
    ],
  };
};
