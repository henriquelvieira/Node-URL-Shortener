import Redis, { RedisOptions } from 'ioredis';

import logger from '../logger';
import Configs from '../util/configs';
import Env from '../util/env';

class RedisClient {
  redisCliente: Redis.Redis;

  constructor() {
    const stringConnection = this.getStringConnection();
    this.redisCliente = new Redis(stringConnection);
    logger.info('Redis connected');
  }

  private getStringConnection(): RedisOptions {
    const configs = Configs.get('App.envs.REDIS');

    const port = Number(Env.get(configs.get('Port')));
    const password = Env.get(configs.get('Password')) as string;
    const host = Env.get(configs.get('Host')) as string;
    const family = 4; /*Number(Env.get(configs.get('Family')));*/
    const keyPrefix = 'cache:';
    // const stringRedisConnection = `redis://:${password}@${host}:${port}/${family}`;

    const connectionOptions: RedisOptions = {
      port: port,
      host: host,
      family: family,
      password: password,
      db: 0,
      keyPrefix: keyPrefix,
    };

    return connectionOptions;
  }

  public async get(key: string) {
    const value = await this.redisCliente.get(key);

    return value ? JSON.parse(value) : null;
  }

  public set(key: string, value: string, timeExp?: number) {
    const timeExpInSeconds = timeExp || 60 * 2;
    return this.redisCliente.set(
      key,
      JSON.stringify(value),
      'EX',
      timeExpInSeconds
    );
  }

  public del(key: string) {
    return this.redisCliente.del(key);
  }

  public async delPrefix(prefix: string) {
    const keys = (await this.redisCliente.keys(`cache:${prefix}:*`)).map(
      (key) => key.replace('cache:', '')
    );
    return this.redisCliente.del(keys);
  }

  public close(): void {
    this.redisCliente.quit();
    logger.info('Redis closed');
  }
}

export default new RedisClient();

// const redisCliente = new Redis({
//   port: port, // Redis port
//   host: host, // Redis host
//   family: family,
//   password: password,
//   db: 0,
// });

// const redisCliente = new Redis(stringRedisConnection);

// function getRedis(value: string) {
//   const syncRedisGet = promisify(redisCliente.get).bind(redisCliente);
//   return syncRedisGet(value);
// }

// function setRedis(key: string, value: string) {
//   const syncRedisSet = promisify(redisCliente.set).bind(redisCliente);
//   return syncRedisSet(key, value);
// }

// export { redisCliente, getRedis, setRedis };
