import { defineConfig } from 'cypress';

function getBaseConfig() {
  return defineConfig({
    videosFolder: 'cypress-run/videos',
    screenshotsFolder: 'cypress-run/screenshots',
    downloadsFolder: 'cypress-run/downloads',
  });
}

export function getCTConfig() {
  return defineConfig({
    ...getBaseConfig(),
    component: {
      specPattern: '**/*.cy.{js,ts,jsx,tsx}',
      devServer: {
        bundler: 'vite',
        framework: 'vue',
      },
    },
  });
}

export function getE2EPackageConfig() {
  return defineConfig({
    ...getBaseConfig(),
    e2e: {
      fileServerFolder: '.',
      specPattern: 'src/e2e/**/*.cy.{js,jsx,ts,tsx}',
      supportFile: 'src/support/e2e.ts',
      fixturesFolder: 'src/fixtures',
      // TODO: Use an env var or some other way of keeping this in sync with whatever the app uses?
      baseUrl: 'http://localhost:4173',
    },
  });
}
