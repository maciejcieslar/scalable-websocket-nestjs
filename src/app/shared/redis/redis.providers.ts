import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

import { REDIS_PUBLISHER_CLIENT, REDIS_SUBSCRIBER_CLIENT } from './redis.constants';

export type RedisClient = Redis.Redis;

export const redisProviders: Provider[] = [
  {
    useFactory: (): RedisClient => {
      return new Redis({
        host: 'socket-redis',
        port: 6379,
      });
    },
    provide: REDIS_SUBSCRIBER_CLIENT,
  },
  {
    useFactory: (): RedisClient => {
      return new Redis({
        host: 'socket-redis',
        port: 6379,
      });
    },
    provide: REDIS_PUBLISHER_CLIENT,
  },
];
