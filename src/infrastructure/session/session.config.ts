import session from 'express-session';
import { RedisStore } from 'connect-redis';
import type Redis from 'ioredis';

export function createSession(redisClient: Redis) {
  return session({
    store: new RedisStore({
      client: redisClient as any, // Type cast to fix compatibility
      prefix: 'sess:',
      ttl: 28800, // 8 hours in seconds
    }),
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 8, // 8 hours
    },
  });
}
