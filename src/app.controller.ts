import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import { FooBarService } from './fooBar.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly fooBarService: FooBarService) {}

  @Get(':value')
  async getFooBar(
    @Param('value', new ParseIntPipe()) value: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<string> {
    const result = await this.fooBarService.getValue(value);
    res.appendHeader('x-cached-result', result.isCached.toString());
    return result.value;
  }
}
