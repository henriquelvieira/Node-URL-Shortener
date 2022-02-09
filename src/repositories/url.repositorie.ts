// import DatabaseError from "../models/errors/database.error.model";
// import { IUrl, Url } from "../models/url.model";

// class UrlRepository {

//     public async findUrl (urlData: IUrl): Promise<IUrl> {

//         try {
//             const urlResponseDB = await Url.findOne({ original: urlData.original });
//             // const urlResponseDB: IUrl= {
//             //     original: urlReq.original,
//             //     shortened: generateShortid()
//             // }; //TO DO: Remover apos ajustar conexão com o banco (MOCK)
            
//             return urlResponseDB; 

//             // if (urlResponseDB) {
//             //     return urlResponseDB; 
//             // }
    
//         } catch (error) {
//             throw new DatabaseError ('Erro ao consultar a URL');               
//         }                
//     }

// }

// export default UrlRepository;