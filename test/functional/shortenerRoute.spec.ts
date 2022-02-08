import request from 'supertest';
import SetupServer from '../../src/server';
import config from 'config';

//Testes Funcionais (E2E)
describe("(/) - Shortener Route's", () => {
    
    let app: any;
    let url_shortened: string;

    beforeAll(async () => {
        const server = new SetupServer(config.get('App.port'));
        await server.init();      
        app = server.getApp(); 
    });

    it("(POST /) - Should be able shorter a URL", async () => {
        
        const requestBody = {
            "original": "http://www.dba-oracle.com/t_calling_oracle_function.htm"
        };
        
        const response = await request(app)
        .post('/')
        .set('Content-Type', 'application/json') 
        .send(requestBody);

        url_shortened = response.body.shortened as string;
        
        expect(response.status).toBe(200);
        expect(url_shortened.length).toBeGreaterThan(0);  
        
        expect(response.body).toEqual(
            expect.objectContaining({
                original: expect.stringContaining('http'),
                shortened: expect.any(String),
                url_shortened: expect.stringContaining('http')
             })
        );

    });

    it("(GET /) - Should be able shorter a URL", async () => {
        
        const response = await request(app)
        .get(`/${url_shortened}`)
        .set('Content-Type', 'application/json') 
        .send();

        expect(response.status).toBe(200);
        expect(url_shortened.length).toBeGreaterThan(0);  

        expect(response.body).toEqual(
            expect.objectContaining({
                original: expect.stringContaining('http'),
                shortened: expect.any(String)
             })
        );

    });


    it("(POST /) - Should not be able shorter a URL", async () => {
        
        const requestBody = {
            "original": ""
        };
        
        const response = await request(app)
        .post('/')
        .set('Content-Type', 'application/json') 
        .send(requestBody);

        url_shortened = response.body.shortened as string;
        
        expect(response.status).toBe(400);
        expect(response.body).not.toHaveProperty('original');
        expect(response.body).not.toHaveProperty('shortened');
        expect(response.body).not.toHaveProperty('url_shortened');
    });

    it("(GET /) - Should not be able shorter a URL", async () => {
        
        const response = await request(app)
        .get(`/`)
        .set('Content-Type', 'application/json') 
        .send();

        expect(response.body).not.toHaveProperty('original');
        expect(response.body).not.toHaveProperty('shortened');
        

    });

});
