import micromatch from 'micromatch';

export default function lintStaged(allStagedFiles: string[]) {
  const codeFiles = micromatch(
    allStagedFiles,
    '**/*.(js|mjs|cjs|ts|mts|cts|vue)',
  ).join(' ');

  return [
    // Build packages affected by uncommitted changes
    'nx affected --target=build --uncommitted',
    // Nx integrity check
    'nx workspace-lint',
    // Lint any files which are not part of an app (eslint will handle ignoring any staged files
    // which are not part of an app via its ignore rules)
    `eslint --fix --ignore-pattern packages/ ${codeFiles}`,
    // Lint any packages affected by uncommitted changes (we're having it lint all files on all
    // affected packages so that if a typechecking rule became invalidated, it gets caught)
    'nx affected --target=lint --uncommitted --fix',
    // Test packages affected by uncommitted changes
    'nx affected --target=test --uncommitted',
  ];
}
