import { Injectable } from '@nestjs/common';

@Injectable()
export class Foo {
  public isFoo(value: number): boolean {
    if (value != 0 && value % 3 == 0) {
      return true;
    }
    return false;
  }
}
