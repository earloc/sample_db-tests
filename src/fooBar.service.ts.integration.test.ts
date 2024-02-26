import { FooBarService } from './fooBar.service';
import { ConfigureTransient } from '../test/db/db.lifecycle';
import { AppModule } from './app.module';

const testSuiteName = 'FooBar';

describe(testSuiteName, () => {
  let sut: FooBarService;

  ConfigureTransient(testSuiteName, [AppModule], (app) => {
    sut = app.get<FooBarService>(FooBarService);
  });

  describe('should return', () => {
    it('input', async () => {
      expect((await sut.getValue(0)).value).toBe('0');
      expect((await sut.getValue(1)).value).toBe('1');
      expect((await sut.getValue(2)).value).toBe('2');
      expect((await sut.getValue(4)).value).toBe('4');
      expect((await sut.getValue(7)).value).toBe('7');
      expect((await sut.getValue(8)).value).toBe('8');
    });
    it('"foo"', async () => {
      expect((await sut.getValue(3)).value).toBe('foo');
      expect((await sut.getValue(6)).value).toBe('foo');
      expect((await sut.getValue(9)).value).toBe('foo');
    });
    it('"bar"', async () => {
      expect((await sut.getValue(5)).value).toBe('bar');
      expect((await sut.getValue(10)).value).toBe('bar');
    });

    it('foobar', async () => {
      expect((await sut.getValue(15)).value).toBe('foobar');
      expect((await sut.getValue(30)).value).toBe('foobar');
    });
  });

  it('should generate correct values for inputs', async () => {
    for (let i = 0; i < 1337; i++) {
      let expected = i.toString();

      if (i != 0 && i % 3 == 0) {
        expected = 'foo';
      }

      if (i != 0 && i % 5 == 0) {
        expected = 'bar';
      }

      if (i != 0 && i % 3 == 0 && i % 5 == 0) {
        expected = 'foobar';
      }

      const actual = await sut.getValue(i);

      expect(actual.value).toBe(expected);
    }
  });

  it('should caches unknown values', async () => {
    expect((await sut.getValue(0)).isCached).toBeFalsy();
    expect((await sut.getValue(0)).isCached).toBeTruthy();
  });
});
