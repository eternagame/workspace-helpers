import lintStagedBase from '@eternagame/lint-staged-utils';

export default function lintStaged(stagedFiles) {
  return [
    // eslint-plugin and jest-utils have to be built for linting and testing to work
    'nx build eslint-plugin',
    'nx build jest-utils',
    ...lintStagedBase(stagedFiles),
  ];
}
