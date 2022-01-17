module.exports = function (isTypescript) {
  const base = isTypescript
    ? require('eslint-config-airbnb-typescript/lib/shared')
    : require('eslint-config-airbnb-base/rules/imports');

  function enforceModuleBoundaries(allowCircularSelfDependency) {
    return {
      '@nrwl/nx/enforce-module-boundaries': [
        'error',
        {
          allowCircularSelfDependency,
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    };
  }

  function noExtraneousDependencies(ignoreDev) {
    return {
      'import/no-extraneous-dependencies': [
        base.rules['import/no-extraneous-dependencies'][0],
        {
          ...base.rules['import/no-extraneous-dependencies'][1],
          // We put our dependencies in the package.json at the root of our repo, not the one
          // closest to each package
          packageDir: '.',
          // Some files, such as tests and configs, allow for imports to be placed in dev dependencies
          // by default. We want to blanket allow this behavior for files outside our nx packages
          ...(ignoreDev ? { devDependencies: true } : {}),
        },
      ],
    };
  }

  return {
    plugins: ['@nrwl/nx'],
    rules: {
      ...enforceModuleBoundaries(false),
      ...noExtraneousDependencies(false),
    },
    overrides: [
      {
        files: [
          '**/__tests__/*.{j,t}sx?',
          '**/test/**/*.{j,t}sx?',
          '**/*.test.{j,t}sx?',
          '**/*.spec.{j,t}sx?',
        ],
        rules: {
          // Allow tests to import parts of a package via the public interface, which is handy when
          // we have one folder of tests for an entire package
          ...enforceModuleBoundaries(true),
        },
      },
      {
        files: ['!(packages,apps,libs)/**/*'],
        rules: {
          ...noExtraneousDependencies(true),
        },
      },
    ],
  };
};
