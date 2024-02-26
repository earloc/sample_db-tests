import { Injectable } from '@nestjs/common';
import { Bar } from './bar';
import { Foo } from './foo';
import { FooBarCache } from './fooBar.cache';

export interface CachedResult {
  value: string;
  isCached: boolean;
}

@Injectable()
export class FooBarService {
  constructor(
    private cache: FooBarCache,
    private foo: Foo,
    private bar: Bar,
  ) {}

  public async getValue(value: number): Promise<CachedResult> {
    const cached = await this.cache.tryGet(value);

    if (!cached.isMissed) {
      return {
        isCached: true,
        value: cached.value,
      };
    }

    let foobar: string = '';

    if (this.foo.isFoo(value)) {
      foobar += 'foo';
    }

    if (this.bar.isBar(value)) {
      foobar += 'bar';
    }

    const result = foobar == '' ? value.toString() : foobar;

    await this.cache.add(value, result);

    return {
      isCached: false,
      value: result,
    };
  }
}
