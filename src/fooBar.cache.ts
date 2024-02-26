import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export interface CachedValue {
  value: string;
  isMissed: boolean;
}

@Injectable()
export class FooBarCache {
  constructor(private db: PrismaClient) {}

  public async tryGet(value: number): Promise<CachedValue> {
    const record = await this.db.fooBars.findFirst({
      select: {
        value: true,
      },
      where: {
        id: value,
      },
    });

    return {
      value: record?.value ?? null,
      isMissed: !record,
    };
  }

  public async add(id: number, value: string): Promise<void> {
    await this.db.fooBars.create({
      data: {
        id,
        value,
      },
    });
  }
}
