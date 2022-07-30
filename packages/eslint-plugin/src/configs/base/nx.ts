import noExtraneousDependencies from './extraneous-deps';

export default function getConfig(isTypescript: boolean) {
  function enforceModuleBoundaries(allowCircularSelfDependency: boolean) {
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

  return {
    overrides: [
      {
        files: isTypescript
          ? ['*.ts', '*.tsx', '*.js', '*.jsx']
          : ['*.js', '*.jsx'],
        plugins: ['@nrwl/nx'],
        rules: {
          ...enforceModuleBoundaries(false),
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
              // Allow files not contained in our actual source code (eg, config files) to import dev dependencies
              ...noExtraneousDependencies(true, isTypescript),
            },
          },
        ],
      },
      {
        files: ['package.json'],
        plugins: ['@eternagame'],
        parser: 'jsonc-eslint-parser',
        rules: {
          '@eternagame/monorepo-dep-location': 'error',
        },
      },
    ],
  };
}
