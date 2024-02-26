import { Injectable } from '@nestjs/common';

@Injectable()
export class Bar {
  public isBar(value: number): boolean {
    if (value != 0 && value % 5 == 0) {
      return true;
    }

    return false;
  }
}
