import { logger, Tree } from '@nrwl/devkit';
import {
  parseDocument, YAMLSeq,
} from 'yaml';
import { insertStep, stepExists } from '@/utils/yaml';

const CACHE_CYPRESS_STEP = {
  name: 'Cache Cypress binary',
  uses: 'actions/cache@v3',
  with: {
    path: '~/.cache/Cypress',
    // eslint-disable-next-line no-template-curly-in-string
    key: "${{ runner.os }}-cypress-${{ hashFiles('**/package.json') }}",
  },
};

const CYPRESS_DEPS_STEP = {
  name: 'Install Cypress dependencies',
  run: 'sudo apt-get install -y libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb',
};

const SETUP_XVFB_STEP = {
  name: 'Set up xvfb for Cypress',
  run: 'Xvfb -screen 0 1024x768x24 :99 &\necho "DISPLAY=:99" >> $GITHUB_ENV',
};

/**
 * Update the GitHub Actions CI workflow with the necessary steps for running Cypress.
 * This includes:
 *   - Caching the Cypress binary
 *   - Installing system dependencies
 *   - Manually configuring X server
 *
 * @param tree
 */
export default function updateGitHubActions(tree: Tree) {
  const WORKFLOW_PATH = '.github/workflows/ci.yml';

  const workflowRaw = tree.read(WORKFLOW_PATH, 'utf-8');
  if (workflowRaw) {
    const workflow = parseDocument(workflowRaw);

    const steps = workflow.getIn(['jobs', 'build', 'steps']);
    if (!steps || !(steps instanceof YAMLSeq)) {
      logger.info('GitHub actions CI file found but jobs.build.steps not found or invalid - skipping Actions config for Cypress');
      return;
    }

    if (!stepExists(steps, 'End to End Tests')) {
      logger.info('No end to end test step present in Actions CI workflow - skipping Cypress CI setup');
      return;
    }

    // If it doesn't exist, add a step to the workflow to cache the Cypress binary
    if (!stepExists(steps, CACHE_CYPRESS_STEP.name)) {
      if (insertStep(workflow, steps, 'after', 'Cache node modules', CACHE_CYPRESS_STEP)) {
        // Good
      } else if (insertStep(workflow, steps, 'before', 'Install dependencies', CACHE_CYPRESS_STEP)) {
        // Good
      } else {
        logger.info('Can\'t find location to insert Cypress caching step in Actions CI workflow - skipping');
      }
    }

    // If it doesn't exist, add a step to the workflow to install system dependencies for Cypress
    if (!stepExists(steps, CYPRESS_DEPS_STEP.name)) {
      if (insertStep(workflow, steps, 'before', (name) => name.toLowerCase().startsWith('Use Node.js'.toLowerCase()), CYPRESS_DEPS_STEP)) {
        // Good
      } else if (insertStep(workflow, steps, 'before', (name) => name.toLowerCase().startsWith('Install dependencies'.toLowerCase()), CYPRESS_DEPS_STEP)) {
        // Good
      } else {
        logger.warn('Can\'t find location to insert Cypress dependency install step in Actions CI workflow - skipping');
      }
    }

    // If it doesn't exist, add a step to the workflow to manually configure X server before
    // running Cypress to protect against intermittent test failures
    if (!stepExists(steps, SETUP_XVFB_STEP.name)) {
      if (insertStep(workflow, steps, 'before', (name) => name.toLowerCase().startsWith('End to end tests'.toLowerCase()), SETUP_XVFB_STEP)) {
        // Good
      } else {
        logger.warn('Can\'t find location to insert Cypress xvfb setup step in Actions CI workflow - skipping');
      }
    }
  }
}
