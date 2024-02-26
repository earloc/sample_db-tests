/* eslint-disable import/no-extraneous-dependencies */
import { start } from 'repl';
import { DockerComposeEnvironment, StartedDockerComposeEnvironment, getContainerRuntimeClient } from 'testcontainers';

// https://stackoverflow.com/a/71405472
require('ts-node').register({
  transpileOnly: true,
});

type ServiceContainer = {
  id: string,
  name: string
}

const setup = async (): Promise<void> => {

  const runtime = await getContainerRuntimeClient();
  const containers = await runtime.container.list();
  const runningContainers = containers
    .filter(x => x.State === 'running')
    .map(x => x.Labels['com.docker.compose.service'])
    .filter(x => x)
  ;

  const requiredServices : ServiceContainer[] = [
    { id: 'q', name: 'FooBar-Q' },
    { id: 'db', name: 'FooBar-DB' },
  ];

  const startedEnvironment = await startEnvironment(requiredServices, runningContainers);

  globalThis.__TestContainer_ENVIRONMENT__ = startedEnvironment
};


async function startEnvironment(requiredServices: ServiceContainer[], runningContainers: string[]) : Promise<StartedDockerComposeEnvironment | null> {
  const composeFile = 'docker-compose.yml';
  console.log();
  console.log(`🥾 Booting up test-containers based on '${composeFile}'`)
  const environment = new DockerComposeEnvironment('.', composeFile);

  const runningServices = requiredServices
    .filter(x => runningContainers.includes(x.id))
  ;

  const neededServices = requiredServices
    .filter(x => !runningContainers.includes(x.id))
  ;

  for (const service of runningServices) {
    console.log(`✅ testcontainers:  reusing --->  '${service.id} -> ${service.name}'`);
  } 

  if (neededServices.length <= 0) {
    return null;
  }

  for (const service of neededServices) {
    console.log(`🚀 testcontainers:  starting ---> '${service.id} -> ${service.name}'`);
  } 

  try {
    const startedEnvironment = await environment.withBuild().up(neededServices.map(x => x.id));
    
    for (const service of neededServices) {
      const startedContainer = startedEnvironment.getContainer(service.name);
      console.log(`👍 testcontainers: ready -----> '${service.id} -> ${startedContainer.getName()}'`);
    } 
    return startedEnvironment;
  } catch(error) {
    console.warn(`💥 testcontainers:  failed. Hoping 🤞 for a fallback depdency`);
    console.warn(error);
    return null;
  }
}

export default setup;
