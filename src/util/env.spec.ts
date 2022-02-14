import Configs from '../util/configs';
import Env from '../util/env';

describe('Env', () => {
  it('(Env.get) - Should be possible get an enviroment variable', async () => {
    const configs = Configs.get('App.envs.MONGODB');

    const connectionString = Env.get(configs.get('connectionString')) as string;

    expect(connectionString).toBeTruthy();
    expect(connectionString.length).toBeGreaterThan(0);
  });
});
