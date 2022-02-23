const micromatch = require('micromatch');

// Our usage of lint-staged requires a bit of explanation. First off, what's so special about this
// being a JS file exporting a function? We can return commands that will run without any files
// being appended to them. Why would we do such a thing? That way, we can rely on lint-staged
// to handle staging any updated files for us, which is, surprisingly, not trivial whatsoever.
module.exports = (allStagedFiles) => {
  const codeFiles = micromatch(allStagedFiles, [
    '**/*.js',
    '**/*.ts',
    '**/*.vue',
  ]).join(' ');

  return [
    // Lint any files which are not part of an app (eslint will handle ignoring any staged files
    // which are not part of an app via its ignore rules)
    `npm run _lint-workspace ${codeFiles}`,
    // Lint any packages affected by uncommitted changes
    'nx affected --target=lint --uncommitted --fix',
    // Format any packages (or files not in a package) affected by uncommitted changes
    `npx prettier --write --ignore-unknown ${allStagedFiles.join(' ')}`,
  ];
};
