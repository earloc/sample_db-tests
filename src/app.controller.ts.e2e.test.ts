import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './app.module';
import { ConfigureScoped } from '../test/db/db.lifecycle';

const suiteName = 'AppController';

describe(suiteName, () => {
  let app: INestApplication;

  ConfigureScoped(suiteName, [AppModule], async (module) => {
    app = module.createNestApplication();
    await app.init();
  });

  describe('(GET)', () => {
    it('returns "0"', () => {
      return request(app.getHttpServer()).get('/0').expect(200).expect('0');
    });

    it('returns "foo"', () => {
      return request(app.getHttpServer()).get('/3').expect(200).expect('foo');
    });
    it('returns "bar"', () => {
      return request(app.getHttpServer()).get('/5').expect(200).expect('bar');
    });
    it('returns "foobar"', () => {
      return request(app.getHttpServer())
        .get('/15')
        .expect(200)
        .expect('foobar');
    });

    it('caches results', async () => {
      const firstResponse = await request(app.getHttpServer()).get('/42');
      expect(firstResponse.status).toBe(200);
      expect(firstResponse.headers['x-cached-result']).toBe(false.toString());

      const secondResponse = await request(app.getHttpServer()).get('/42');
      expect(secondResponse.status).toBe(200);
      expect(secondResponse.headers['x-cached-result']).toBe(true.toString());
    });
  });
});
