// eslint-disable-next-line import/no-extraneous-dependencies
import { StartedDockerComposeEnvironment } from 'testcontainers';

/* eslint-disable import/no-extraneous-dependencies */
// https://stackoverflow.com/a/71405472
require('ts-node').register({
  transpileOnly: true,
});

const teardown = async (): Promise<void> => {

  await Promise.all([
    tryStop(globalThis.__TestContainer_ENVIRONMENT__),
  ]);
};

async function tryStop(startedComposeEnvironment: StartedDockerComposeEnvironment | undefined | null) : Promise<void> {
  if (!startedComposeEnvironment) {
    return;
  }
  try {
    console.log(`👋 testcontainer: Farewell`)
    await startedComposeEnvironment.down();
    console.log(`🧹 testcontainer: Wiped away`)
  } catch (error) {
    console.warn(error);
  }
}

export default teardown;
