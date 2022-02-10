import {
  formatURL,
  generateShortid,
} from '../controllers/shortener.controller';
import { IUrl } from '../models/url.model';

describe('ShortenerController', () => {
  it('(create) - Should be able shorter a URL', async () => {
    const url: IUrl = { original: 'www.google.com' };

    const urlID = generateShortid();

    const urlShortened = formatURL(urlID);

    const response = {
      original: url.original,
      shortened: urlID,
      urlShortened: urlShortened,
    };

    expect(url).toHaveProperty('original');
    expect(urlID.length).toBeGreaterThan(0);

    expect(response).toHaveProperty('original');
    expect(response).toHaveProperty('shortened');
    expect(response).toHaveProperty('urlShortened');
  });

  it('(redirect) - Should be able redirect to original URL', async () => {
    const shortURL = 'http://localhost:4001/vxZ3qSsCt';

    const urlOriginal =
      'http://www.dba-oracle.com/t_calling_oracle_function.htm';

    const response: IUrl = { original: urlOriginal, urlShortened: shortURL };

    expect(response).toHaveProperty('original');
    expect(response).toHaveProperty('urlShortened');
  });
});
