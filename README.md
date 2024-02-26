## Description

Demo showcasing test-case execution against a database. Uses

- [NestJS](https://docs.nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [TestContainers](https://testcontainers.com/)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

```

Before test-execution, a database container is started on demand. This container will contain a default database, which is already migrated to the latest schema.

> This might take some time, if this is the first time the underyling container-image has to be built.

Sometimes it may speed up things, to start the containers outside of the test-execution context.

```bash
$ docker compose up --build -d
```

Remember to tear down the compose-environment, to leverage automatic bootstrapping of the containers during test-execution:

```bash
$ docker compose down
```

### using test-databases

In a test-suite, use one of the provided database bootstrappers

#### singleton
The global (singleton-) database is used.
This is the "fastest" approach when it comes to test-execution, but may suffer from tests mutating globally shared state. 
To get a stable enough experience, testcontainers should be setup and torn down on each run, which adds a lot of overhead again.


```typescript
import { ConfigureSingleton } from '../test/db/db.lifecycle';

const testSuiteName = 'SomeTestSuiteName';

describe(testSuiteName, () => {

  let systemUnderTest : FooBarService;

  ConfigureSingleton(testSuiteName, [AppModule], (app) => {
    systemUnderTest = app.get<FooBarService>(FooBarService);
  });

  it ('just works', async () => {
    const result = await systemUnderTest.getValue(15);
    expect(result.value).toBe('foobar');
    expect(result.isCached).toBe(false); //will fail in subsequent calls, as global state gets mutated, implicitly
  })

});
  
```

#### scoped
A fresh database gets created for each test-suite, before any test is run from the suite.
The database is reset after all tests has been executed. 
This ensures state mutation is only local to the surrounding test-suite.

```typescript
import { ConfigureScoped } from '../test/db/db.lifecycle';

const testSuiteName = 'SomeTestSuiteName';

describe(testSuiteName, () => {

  let systemUnderTest : FooBarService;

  ConfigureScoped(testSuiteName, [AppModule], (app) => {
    systemUnderTest = app.get<FooBarService>(FooBarService);
  });

  it ('just works', async () => {
    const result = await systemUnderTest.getValue(15);
    expect(result.value).toBe('foobar');
    expect(result.isCached).toBe(false); // will succeed in subsequent calls, as shared state gets torn down after each test run

    const resultAgain = await systemUnderTest.getValue(15);
    expect(result.isCached).toBe(true);
  })

});
  
```

#### transient
A fresh, randomly named database gets created for each test in a suite.
The database is not reset to be inspectable after test-execution (as long as the container is not downed, automatically). 
This ensures state mutation is only local in respect to the current test.

```typescript
import { ConfigureScoped } from '../test/db/db.lifecycle';

const testSuiteName = 'SomeTestSuiteName';

async function withTestData(
  db: PrismaClient,
  items: Array<{ id: number; value: string }>,
) {
  await db.fooBars.createMany({
    data: items,
  });
}

describe(testSuiteName, () => {

  let systemUnderTest : FooBarService;
  let db: PrismaClient;

  ConfigureTransient(testSuiteName, [AppModule], (app) => {
    systemUnderTest = app.get<FooBarService>(FooBarService);
    db = app.get<PrismaClient>(PrismaClient);
  });

  

  it ('just works', async () => {
    const result = await systemUnderTest.getValue(15);
    expect(result.isCached).toBe(false); // will always succeed, as there is no shared state between tests
    expect(result.value).toBe('foobar');
  });

  it ('just works here too', async () => {
    withTestData({
      id: 15, value:'some-test-data'
    })
    const result = await systemUnderTest.getValue(15);

    expect(result.isCached).toBe(true); // will always succeed, as test-data gets inserted into the transient database just before the run
    expect(result.value).toBe('some-test-data');
  });

});
  
```


## License

[MIT licensed](LICENSE).
