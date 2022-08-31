import lintStagedBase from '@eternagame/lint-staged-utils';

export default function lintStaged(stagedFiles) {
  return [
    // eslint-plugin has to be built for linting and testing to work
    'nx build eslint-plugin',
    ...lintStagedBase(stagedFiles),
  ];
}
