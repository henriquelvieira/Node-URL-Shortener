import Redis from 'ioredis';
import { promisify } from 'util';

import Configs from '../util/configs';
import Env from '../util/env';

const configs = Configs.get('App.envs.REDIS');

const port = Number(Env.get(configs.get('Port')));
const password = Env.get(configs.get('Password')) as string;
const host = Env.get(configs.get('Host')) as string;
const family = Env.get(configs.get('Family')) as string;

const stringRedisConnection = `redis://:${password}@${host}:${port}/${family}`;

// const redisCliente = new Redis({
//   port: port, // Redis port
//   host: host, // Redis host
//   family: family,
//   password: password,
//   db: 0,
// });

const redisCliente = new Redis(stringRedisConnection);

function getRedis(value: string): Promise<unknown> {
  const syncRedisGet = promisify(redisCliente.get).bind(redisCliente);
  return syncRedisGet(value);
}

function setRedis(key: string, value: string): Promise<unknown> {
  const syncRedisSet = promisify(redisCliente.set).bind(redisCliente);
  return syncRedisSet(key, value);
}

export { redisCliente, getRedis, setRedis };
