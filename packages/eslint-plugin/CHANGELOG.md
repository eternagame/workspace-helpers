# Changelog

## 2.0.0 (2023-05-09)


### Bug Fixes

* **bootstrap,eslint-plugin,nx-plugin:** Consolidated fixes from runthrough ([#177](https://github.com/eternagame/workspace-helpers/issues/177)) ([3f2f83a](https://github.com/eternagame/workspace-helpers/commit/3f2f83ae389571d658ac6b9856f5b247d28d8d76))
* **eslint-plugin,nx-plugin:** Consolidated fixes from runthrough (pt2) ([#178](https://github.com/eternagame/workspace-helpers/issues/178)) ([b709a60](https://github.com/eternagame/workspace-helpers/commit/b709a60dca8acf24691a69016d7586fe0446bdff))
* **eslint-plugin:** Disable ts-eslint intent rule for parameter decorator ([#222](https://github.com/eternagame/workspace-helpers/issues/222)) ([185da91](https://github.com/eternagame/workspace-helpers/commit/185da916a550a97e5805145fab4c2442c139e78f))
* **eslint-plugin:** Fix vs code linting with extraneous-deps ([#104](https://github.com/eternagame/workspace-helpers/issues/104)) ([97c400e](https://github.com/eternagame/workspace-helpers/commit/97c400e4645d8e6a611d41600bf7a3ee049108ff))
* **nx-plugin,eslint-plugin:** Fix cypress e2e linting ([b709a60](https://github.com/eternagame/workspace-helpers/commit/b709a60dca8acf24691a69016d7586fe0446bdff))
* **nx-plugin,eslint-plugin:** Fix lint errors in nest template ([b709a60](https://github.com/eternagame/workspace-helpers/commit/b709a60dca8acf24691a69016d7586fe0446bdff))
* **nx-plugin:** Fix canary publishes by specifying package access ([#134](https://github.com/eternagame/workspace-helpers/issues/134)) ([da12730](https://github.com/eternagame/workspace-helpers/commit/da127304c07afaa8a31c74dcd210bc8b291b7a88))
* **nx-plugin:** Improve reliability of peer dependency handling ([b709a60](https://github.com/eternagame/workspace-helpers/commit/b709a60dca8acf24691a69016d7586fe0446bdff))
* **nx-plugin:** Properly apply root styles in cypress component tests ([b709a60](https://github.com/eternagame/workspace-helpers/commit/b709a60dca8acf24691a69016d7586fe0446bdff))
* **nx-plugin:** Publish concurrency fixes ([#173](https://github.com/eternagame/workspace-helpers/issues/173)) ([dd7586b](https://github.com/eternagame/workspace-helpers/commit/dd7586b1f2bf50d246d63256d447b259ebc2c5f0))
* **vite:** Correctly omit all dependencies from bundles ([30bf46c](https://github.com/eternagame/workspace-helpers/commit/30bf46c938a36308a4753698e1cf344e8c0ea66b))


### Documentation

* **nx-plugin:** Update test command info ([3f2f83a](https://github.com/eternagame/workspace-helpers/commit/3f2f83ae389571d658ac6b9856f5b247d28d8d76))
* **repo:** Improve usage instructions for individual packages ([#123](https://github.com/eternagame/workspace-helpers/issues/123)) ([5845a5a](https://github.com/eternagame/workspace-helpers/commit/5845a5a3b1fcf9c020638155086b86496af88bc8))


### Features and Enhancements

* **eslint-plugin,nx:** Centralize typescript-eslint parserOptions.project ([#58](https://github.com/eternagame/workspace-helpers/issues/58)) ([eef26b2](https://github.com/eternagame/workspace-helpers/commit/eef26b2921563f930403b7fa4e9a39d118cbccbd))
* **eslint-plugin,tsconfig:** Use eslint to check for unused variables instead of typescript ([#88](https://github.com/eternagame/workspace-helpers/issues/88)) ([c732cfb](https://github.com/eternagame/workspace-helpers/commit/c732cfb79a105508e1c87e415016eb52e69a7e22))
* **eslint-plugin:** Add monorepo-dep-location rule ([#56](https://github.com/eternagame/workspace-helpers/issues/56)) ([30bf46c](https://github.com/eternagame/workspace-helpers/commit/30bf46c938a36308a4753698e1cf344e8c0ea66b))
* **eslint-plugin:** Add typescript-eslint strict rules ([#163](https://github.com/eternagame/workspace-helpers/issues/163)) ([8305fc6](https://github.com/eternagame/workspace-helpers/commit/8305fc6560c6ebde36e91658ec02fa71b11a9073))
* **eslint-plugin:** Allow devDependency imports in vite.config.mjs ([30bf46c](https://github.com/eternagame/workspace-helpers/commit/30bf46c938a36308a4753698e1cf344e8c0ea66b))
* **jest-utils,eslint-plugin,vite-utils:** Clean up peer deps +  fix vue linting ([#145](https://github.com/eternagame/workspace-helpers/issues/145)) ([bd351dc](https://github.com/eternagame/workspace-helpers/commit/bd351dca0dd7471d3ae2caee32820fb12173317f))
* **nx-plugin,cypress-utils,nx-spawn:** Add cypress ([#149](https://github.com/eternagame/workspace-helpers/issues/149)) ([3307700](https://github.com/eternagame/workspace-helpers/commit/3307700da7fcd0ea95473d00ff6e82c295fa2ff8))
* **nx-plugin:** Add console log with listen URL to nest template ([b709a60](https://github.com/eternagame/workspace-helpers/commit/b709a60dca8acf24691a69016d7586fe0446bdff))
* **nx-plugin:** Customize release PR title ([b709a60](https://github.com/eternagame/workspace-helpers/commit/b709a60dca8acf24691a69016d7586fe0446bdff))
* **nx-plugin:** Release automation ([#129](https://github.com/eternagame/workspace-helpers/issues/129)) ([19939bd](https://github.com/eternagame/workspace-helpers/commit/19939bdd7643c1784e6fa634eae51c19cb4f520c))
* **nx-plugin:** Replace jest with vitest ([#151](https://github.com/eternagame/workspace-helpers/issues/151)) ([13f7f24](https://github.com/eternagame/workspace-helpers/commit/13f7f2482cf50b6e58ce4f95dc7fe703f51a7874)), closes [#130](https://github.com/eternagame/workspace-helpers/issues/130) [#131](https://github.com/eternagame/workspace-helpers/issues/131)
* **nx-plugin:** Set default package.json fields in packages ([#120](https://github.com/eternagame/workspace-helpers/issues/120)) ([2383569](https://github.com/eternagame/workspace-helpers/commit/2383569c1a8bb1fa8d40ec04e130d9c0e42674d9))
* **nx-plugin:** Simplify test configuration ([#152](https://github.com/eternagame/workspace-helpers/issues/152)) ([1390712](https://github.com/eternagame/workspace-helpers/commit/13907129d07b99aa9254da2a7c6d425ec6caaa52))
* **nx,eslint-plugin,jest,tsconfig:** Improve globs and use ts for all configs ([#91](https://github.com/eternagame/workspace-helpers/issues/91)) ([791d476](https://github.com/eternagame/workspace-helpers/commit/791d4765ca3a32472fdfa356ae138544bbab7c0a))
* **nx,eslint-plugin:** Enable linting for config files ([#84](https://github.com/eternagame/workspace-helpers/issues/84)) ([0b32aec](https://github.com/eternagame/workspace-helpers/commit/0b32aec17249f3583f3849552e5041776a4e02e0))
* **nx,eslint-plugin:** Remove prettier ([#97](https://github.com/eternagame/workspace-helpers/issues/97)) ([5e16f96](https://github.com/eternagame/workspace-helpers/commit/5e16f96996686a37c9a068cde54405cda19575bb))
* **nx:** Generate LICENSE files per package ([#96](https://github.com/eternagame/workspace-helpers/issues/96)) ([2a4b0af](https://github.com/eternagame/workspace-helpers/commit/2a4b0af5be7336b9a6f8640bffef10302c746fbd))
* **nx:** Remove package.json types field ([#100](https://github.com/eternagame/workspace-helpers/issues/100)) ([007ecb7](https://github.com/eternagame/workspace-helpers/commit/007ecb769fe7d4b4136674205b8ee160bd3c51a1))
* **repo,nx,vite:** Simplify build process, relying on vite ([#95](https://github.com/eternagame/workspace-helpers/issues/95)) ([9160802](https://github.com/eternagame/workspace-helpers/commit/916080226041433552449370bde7f9fe0c057c53))
* **repo:** Standardize package naming and terminology, improve overview of repo components ([#77](https://github.com/eternagame/workspace-helpers/issues/77)) ([bb3e55a](https://github.com/eternagame/workspace-helpers/commit/bb3e55aab019662c8cc1ab7624c46178d2015fe4))
* **tsconfig,nx-plugin,vite-utils,eslint-plugin:** tsconfig + package structure cleanup ([#157](https://github.com/eternagame/workspace-helpers/issues/157)) ([047bccc](https://github.com/eternagame/workspace-helpers/commit/047bcccf57b504e85631ddf06ec56d5c8728d310)), closes [#144](https://github.com/eternagame/workspace-helpers/issues/144)
* **vite:** Build commonjs in addition to esm ([30bf46c](https://github.com/eternagame/workspace-helpers/commit/30bf46c938a36308a4753698e1cf344e8c0ea66b))
* **vite:** Disable bundling and tree shaking for non-webapps ([30bf46c](https://github.com/eternagame/workspace-helpers/commit/30bf46c938a36308a4753698e1cf344e8c0ea66b))


### Dependencies

* **repo:** Bump 2022-12-19 ([#209](https://github.com/eternagame/workspace-helpers/issues/209)) ([ccf5f6f](https://github.com/eternagame/workspace-helpers/commit/ccf5f6fefb210de23369b51e33a83d354c5b8848))
* **repo:** Dependency update ([#168](https://github.com/eternagame/workspace-helpers/issues/168)) ([8318049](https://github.com/eternagame/workspace-helpers/commit/831804974c84b216a97104b89e04017422e3282c))
