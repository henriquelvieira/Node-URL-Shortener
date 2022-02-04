import { Url } from "../@types/url.type";
import { generateShortid } from "../controllers/shortener.controller";

describe("ShortenerController", () => {

    it("(create) - Should be able shorter a URL", async () => {
        const url: Url = {url_original: "www.google.com"};

        const urlID = generateShortid();
        const response = {"url_original": url.url_original,
                          "url_shortened": urlID
                         };

        expect(url).toHaveProperty('url_original');
        expect(urlID.length).toBeGreaterThan(0);

        expect(response).toHaveProperty('url_original');
        expect(response).toHaveProperty('url_shortened');        
    });

    it("(redirect) - Should be able redirect to original URL", async () => {
        const shortURL = "http://localhost:4001/vxZ3qSsCt";

        const urlOriginal = "http://www.dba-oracle.com/t_calling_oracle_function.htm";

        const response: Url = {url_original: urlOriginal,
                               url_shortened: shortURL}; 
                               
        expect(response).toHaveProperty('url_original'); 
        expect(response).toHaveProperty('url_shortened');                               

    });

}
);