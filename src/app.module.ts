import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { FooBarService } from './fooBar.service';
import { Foo } from './foo';
import { Bar } from './bar';
import { FooBarCache } from './fooBar.cache';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [FooBarCache, FooBarService, Foo, Bar, PrismaClient],
})
export class AppModule {}
