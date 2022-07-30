import process from 'process';
import findPkgUp from '../../utils/find-pkg-up';

export default function noExtraneousDependencies(
  ignoreDev: boolean,
  isTypescript: boolean
) {
  // We need to do this dynamically to allow eslint-config-airbnb-typescript to be optional
  /* eslint-disable global-require, @typescript-eslint/no-unsafe-assignment */
  const base: AirBnbImportsConfig = isTypescript
    ? require('eslint-config-airbnb-typescript/lib/shared')
    : require('eslint-config-airbnb-base/rules/imports');
  /* eslint-enable global-require */

  const [noExtDepsLevel, noExtDepsConfig] =
    base.rules['import/no-extraneous-dependencies'];

  return {
    'import/no-extraneous-dependencies': [
      noExtDepsLevel,
      {
        ...noExtDepsConfig,
        // Some files, such as tests and configs, allow for imports to be placed in dev dependencies
        // by default. We want to blanket allow this behavior for files outside our nx packages
        ...(ignoreDev ? { devDependencies: true } : {}),
        packageDir: [process.cwd(), ...findPkgUp(process.cwd())],
      },
    ],
  };
}
