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
            "url_original": "http://www.dba-oracle.com/t_calling_oracle_function.htm"
        };
        
        const response = await request(app)
        .post('/')
        .set('Content-Type', 'application/json') 
        .send(requestBody);

        url_shortened = response.body.id as string;

        expect(response.status).toBe(200);
        expect(url_shortened.length).toBeGreaterThan(0);  
        expect(response.body).toHaveProperty("url_shortened");    
        expect(response.body).toHaveProperty("url_original");  
        expect(response.body).toHaveProperty("id");  
    });

    it("(GET /) - Should be able shorter a URL", async () => {
                
        const response = await request(app)
        .get(`/${url_shortened}`)
        .set('Content-Type', 'application/json') 
        .send();

        expect(response.status).toBe(200);
        expect(url_shortened.length).toBeGreaterThan(0);  
        expect(response.body).toHaveProperty("url_shortened");    
        expect(response.body).toHaveProperty("id");  
        expect(response.body).toHaveProperty("url_original");  
    });


});
