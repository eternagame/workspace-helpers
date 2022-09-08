# Changelog

## 1.0.0 (2022-09-08)


### Bug Fixes

* **bootstrap,eslint-plugin,nx-plugin:** Consolidated fixes from runthrough ([#177](https://github.com/eternagame/workspace-helpers/issues/177)) ([3f2f83a](https://github.com/eternagame/workspace-helpers/commit/3f2f83ae389571d658ac6b9856f5b247d28d8d76))
* **nx-plugin:** Fix canary publishes by specifying package access ([#134](https://github.com/eternagame/workspace-helpers/issues/134)) ([da12730](https://github.com/eternagame/workspace-helpers/commit/da127304c07afaa8a31c74dcd210bc8b291b7a88))
* **nx-plugin:** Publish concurrency fixes ([#173](https://github.com/eternagame/workspace-helpers/issues/173)) ([dd7586b](https://github.com/eternagame/workspace-helpers/commit/dd7586b1f2bf50d246d63256d447b259ebc2c5f0))
* **nx-spawn,bootstrap:** Ensure correct executable permissions ([#146](https://github.com/eternagame/workspace-helpers/issues/146)) ([634eb89](https://github.com/eternagame/workspace-helpers/commit/634eb895e0cc8b4260897f638e34440fd90d6e9f))
* **vite:** Correctly omit all dependencies from bundles ([30bf46c](https://github.com/eternagame/workspace-helpers/commit/30bf46c938a36308a4753698e1cf344e8c0ea66b))


### Features and Enhancements

* **bootstrap:** Support specifying nx plugin version ([#138](https://github.com/eternagame/workspace-helpers/issues/138)) ([9e4440c](https://github.com/eternagame/workspace-helpers/commit/9e4440c45af703cbe9a817a56f4cedb719d12e9f)), closes [#136](https://github.com/eternagame/workspace-helpers/issues/136)
* **eslint-plugin:** Add monorepo-dep-location rule ([#56](https://github.com/eternagame/workspace-helpers/issues/56)) ([30bf46c](https://github.com/eternagame/workspace-helpers/commit/30bf46c938a36308a4753698e1cf344e8c0ea66b))
* **eslint-plugin:** Allow devDependency imports in vite.config.mjs ([30bf46c](https://github.com/eternagame/workspace-helpers/commit/30bf46c938a36308a4753698e1cf344e8c0ea66b))
* **nx-plugin:** Improve application launch commands ([#108](https://github.com/eternagame/workspace-helpers/issues/108)) ([206e4b4](https://github.com/eternagame/workspace-helpers/commit/206e4b4b213a58e0e6540689f16dd6e7a1bf3491))
* **nx-plugin:** Release automation ([#129](https://github.com/eternagame/workspace-helpers/issues/129)) ([19939bd](https://github.com/eternagame/workspace-helpers/commit/19939bdd7643c1784e6fa634eae51c19cb4f520c))
* **nx-plugin:** Replace jest with vitest ([#151](https://github.com/eternagame/workspace-helpers/issues/151)) ([13f7f24](https://github.com/eternagame/workspace-helpers/commit/13f7f2482cf50b6e58ce4f95dc7fe703f51a7874)), closes [#130](https://github.com/eternagame/workspace-helpers/issues/130) [#131](https://github.com/eternagame/workspace-helpers/issues/131)
* **nx-plugin:** Set default package.json fields in packages ([#120](https://github.com/eternagame/workspace-helpers/issues/120)) ([2383569](https://github.com/eternagame/workspace-helpers/commit/2383569c1a8bb1fa8d40ec04e130d9c0e42674d9))
* **nx-plugin:** Simplify test configuration ([#152](https://github.com/eternagame/workspace-helpers/issues/152)) ([1390712](https://github.com/eternagame/workspace-helpers/commit/13907129d07b99aa9254da2a7c6d425ec6caaa52))
* **nx-spawn:** Improve dependency execution ([#60](https://github.com/eternagame/workspace-helpers/issues/60)) ([64cb75c](https://github.com/eternagame/workspace-helpers/commit/64cb75cfca903f5c6fa6971fb4410c670045effe))
* **nx,eslint-plugin,jest,tsconfig:** Improve globs and use ts for all configs ([#91](https://github.com/eternagame/workspace-helpers/issues/91)) ([791d476](https://github.com/eternagame/workspace-helpers/commit/791d4765ca3a32472fdfa356ae138544bbab7c0a))
* **nx,eslint-plugin:** Enable linting for config files ([#84](https://github.com/eternagame/workspace-helpers/issues/84)) ([0b32aec](https://github.com/eternagame/workspace-helpers/commit/0b32aec17249f3583f3849552e5041776a4e02e0))
* **nx,eslint-plugin:** Remove prettier ([#97](https://github.com/eternagame/workspace-helpers/issues/97)) ([5e16f96](https://github.com/eternagame/workspace-helpers/commit/5e16f96996686a37c9a068cde54405cda19575bb))
* **nx:** Generate LICENSE files per package ([#96](https://github.com/eternagame/workspace-helpers/issues/96)) ([2a4b0af](https://github.com/eternagame/workspace-helpers/commit/2a4b0af5be7336b9a6f8640bffef10302c746fbd))
* **nx:** Make nx preset standalone ([#41](https://github.com/eternagame/workspace-helpers/issues/41)) ([0374280](https://github.com/eternagame/workspace-helpers/commit/0374280370d87286cef1cc250fa008e930026616))
* **repo,nx,vite:** Simplify build process, relying on vite ([#95](https://github.com/eternagame/workspace-helpers/issues/95)) ([9160802](https://github.com/eternagame/workspace-helpers/commit/916080226041433552449370bde7f9fe0c057c53))
* **repo:** Standardize package naming and terminology, improve overview of repo components ([#77](https://github.com/eternagame/workspace-helpers/issues/77)) ([bb3e55a](https://github.com/eternagame/workspace-helpers/commit/bb3e55aab019662c8cc1ab7624c46178d2015fe4))
* **tsconfig,nx-plugin,vite-utils,eslint-plugin:** tsconfig + package structure cleanup ([#157](https://github.com/eternagame/workspace-helpers/issues/157)) ([047bccc](https://github.com/eternagame/workspace-helpers/commit/047bcccf57b504e85631ddf06ec56d5c8728d310)), closes [#144](https://github.com/eternagame/workspace-helpers/issues/144)
* **vite:** Build commonjs in addition to esm ([30bf46c](https://github.com/eternagame/workspace-helpers/commit/30bf46c938a36308a4753698e1cf344e8c0ea66b))
* **vite:** Disable bundling and tree shaking for non-webapps ([30bf46c](https://github.com/eternagame/workspace-helpers/commit/30bf46c938a36308a4753698e1cf344e8c0ea66b))


### Documentation

* **nx-plugin:** Update test command info ([3f2f83a](https://github.com/eternagame/workspace-helpers/commit/3f2f83ae389571d658ac6b9856f5b247d28d8d76))
* **repo:** Improve usage instructions for individual packages ([#123](https://github.com/eternagame/workspace-helpers/issues/123)) ([5845a5a](https://github.com/eternagame/workspace-helpers/commit/5845a5a3b1fcf9c020638155086b86496af88bc8))
* **repo:** Standardize on term "repository" instead of "project" ([#160](https://github.com/eternagame/workspace-helpers/issues/160)) ([b7cbf66](https://github.com/eternagame/workspace-helpers/commit/b7cbf66d4106a6c6303daaac827b78f928d30edd)), closes [#148](https://github.com/eternagame/workspace-helpers/issues/148)
