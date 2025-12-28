// src/infrastructure/cache/redis.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

// redis.service.ts
@Injectable()
export class RedisService {
  constructor(private config: ConfigService) {}

  createClient() {
    return new Redis({
      host: this.config.get('REDIS_HOST'),
      port: this.config.get<number>('REDIS_PORT'),
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableReadyCheck: true,
    });
  }
}
