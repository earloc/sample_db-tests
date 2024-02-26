import { PrismaClient } from '@prisma/client';
import { promisify } from 'node:util';
import { exec as execCb } from 'node:child_process';
import { v4 as uuidv4 } from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { DynamicModule, ForwardReference, Type } from '@nestjs/common';

type ModuleImportsType = Array<
  Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
>;

export function ConfigureScoped(
  scopeName: string,
  modules: ModuleImportsType,
  configure: (testingModule: TestingModule) => void | Promise<void>,
) {
  const databaseName = `Transient_${scopeName}_${uuidv4()}`;
  const connectionString = `sqlserver://localhost:1437;database=${databaseName};user=SA;password=AOWSUufrhbnQ?R7816a854re324235r;TrustServerCertificate=true`;
  beforeAll(async () => {
    console.log(databaseName);
    await dbUp(connectionString);

    const moduleUnderTest = await Test.createTestingModule({
      imports: modules,
    })
      .overrideProvider(PrismaClient)
      .useFactory({
        factory: () =>
          new PrismaClient({
            datasourceUrl: connectionString,
          }),
      })
      .compile();

    await configure(moduleUnderTest);
  });

  afterAll(async () => {
    await dbDown(connectionString);
  });
}

export function ConfigureTransient(
  scopeName: string,
  modules: ModuleImportsType,
  configure: (testingModule: TestingModule) => void | Promise<void>,
) {
  let databaseName: string;
  let connectionString: string;

  beforeEach(async () => {
    databaseName = `Transient_${scopeName}_${uuidv4()}`;
    console.log(databaseName);
    connectionString = `sqlserver://localhost:1437;database=${databaseName};user=SA;password=AOWSUufrhbnQ?R7816a854re324235r;TrustServerCertificate=true`;
    await dbUp(connectionString);

    const testingModule = await Test.createTestingModule({
      imports: modules,
    })
      .overrideProvider(PrismaClient)
      .useFactory({
        factory: () =>
          new PrismaClient({
            datasourceUrl: connectionString,
          }),
      })
      .compile();

    await configure(testingModule);
  });
}

const exec = promisify(execCb);

// TODO: re-write this when Prisma.io gets a programmatic migration API
// https://github.com/prisma/prisma/issues/4703
async function dbUp(databaseUrl: string): Promise<void> {
  // throws an error if migration fails
  await exec('npx prisma migrate dev', {
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl,
    },
  });
}

async function dbDown(databaseUrl: string): Promise<void> {
  // resets data and schema of the db
  await exec('npx prisma migrate reset --force', {
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl,
    },
  });
}
