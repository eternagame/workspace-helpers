module.exports = {
  root: true,
  extends: ['plugin:@luxaritas/typescript', 'plugin:@luxaritas/nx-typescript'],
  parserOptions: {
    project: 'tsconfig.*?.json',
  },
};
