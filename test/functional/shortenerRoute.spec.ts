import express from 'express';
import request from 'supertest';

import SetupServer from '../../src/server';
import Configs from '../../src/util/configs';
import Env from '../../src/util/env';

//Testes Funcionais (E2E)
describe("(/) - Shortener Route's", () => {
  let app: express.Express;
  let urlShortened: string;

  beforeAll(async () => {
    const configs = Configs.get('App');
    const port = Number(Env.get(configs.get('envs.APP.Port')));
    const server = new SetupServer(port);
    await server.init();
    app = server.getApp();
  });

  it('(POST /) - Should be able shorter a URL', async () => {
    const requestBody = {
      original: 'http://www.dba-oracle.com/t_calling_oracle_function.htm2',
    };

    const response = await request(app)
      .post('/')
      .set('Content-Type', 'application/json')
      .send(requestBody);

    urlShortened = response.body.shortened as string;

    expect(response.status).toBe(200);
    expect(urlShortened.length).toBeGreaterThan(0);

    expect(response.body).toEqual(
      expect.objectContaining({
        original: expect.stringContaining('http'),
        shortened: expect.any(String),
        urlShortened: expect.stringContaining('http'),
      })
    );
  });

  it('(GET /) - Should be able shorter a URL', async () => {
    const response = await request(app)
      .get(`/${urlShortened}`)
      .set('Content-Type', 'application/json')
      .send();

    expect(response.status).toBe(200);
    expect(urlShortened.length).toBeGreaterThan(0);

    expect(response.body).toEqual(
      expect.objectContaining({
        original: expect.stringContaining('http'),
        shortened: expect.any(String),
      })
    );
  });

  it('(POST /) - Should not be able shorter a URL', async () => {
    const requestBody = {
      original: '',
    };

    const response = await request(app)
      .post('/')
      .set('Content-Type', 'application/json')
      .send(requestBody);

    urlShortened = response.body.shortened as string;

    expect(response.status).toBe(400);
    expect(response.body).not.toHaveProperty('original');
    expect(response.body).not.toHaveProperty('shortened');
    expect(response.body).not.toHaveProperty('urlShortened');
  });

  it('(GET /) - Should not be able shorter a URL', async () => {
    const response = await request(app)
      .get(`/`)
      .set('Content-Type', 'application/json')
      .send();

    expect(response.body).not.toHaveProperty('original');
    expect(response.body).not.toHaveProperty('shortened');
  });
});
