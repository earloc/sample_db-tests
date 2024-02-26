import { PrismaClient } from '@prisma/client';
import { FooBarCache } from './fooBar.cache';
import { ConfigureTransient } from '../test/db/db.lifecycle';
import { AppModule } from './app.module';

async function seed(
  db: PrismaClient,
  items: Array<{ id: number; value: string }>,
) {
  await db.fooBars.createMany({
    data: items,
  });
}
const testSuiteName = 'FooBarCache';

describe(testSuiteName, () => {
  let db: PrismaClient;
  let sut: FooBarCache;

  ConfigureTransient(testSuiteName, [AppModule], (app) => {
    sut = app.get<FooBarCache>(FooBarCache);
    db = app.get<PrismaClient>(PrismaClient);
  });

  describe('tryGet', () => {
    it('misses cache', async () => {
      // relying on empty state
      expect((await sut.tryGet(0)).isMissed).toBeTruthy();
      expect((await sut.tryGet(1)).isMissed).toBeTruthy();
    });
    it('hits cache', async () => {
      // seed some state
      await seed(db, [
        { id: 2, value: '2' },
        { id: 3, value: 'foo' },
        { id: 5, value: 'bar' },
        { id: 15, value: 'foobar' },
      ]);

      expect((await sut.tryGet(2)).isMissed).toBeFalsy();
      expect((await sut.tryGet(3)).isMissed).toBeFalsy();
      expect((await sut.tryGet(5)).isMissed).toBeFalsy();
      expect((await sut.tryGet(15)).isMissed).toBeFalsy();
    });
  });
});
