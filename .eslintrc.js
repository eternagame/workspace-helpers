module.exports = {
  root: true,
  extends: [
    'plugin:@eternagame/typescript',
    'plugin:@eternagame/nx-typescript',
  ],
  parserOptions: {
    project: 'tsconfig.*?.json',
  },
};
