// import MongoConnection from "../database/MongoConnection";


// const mongoose = new MongoConnection();

// const UserSchema = new mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',  
//         required: true,
//     },
//     name: {
//         type: String,
//         required: [true, 'Nome é obrigatório!'],
//     },
//     description: {
//         type: String,
//         required: [true, 'Descrição é obrigatório!'],
//     },

//     icon: {
//         type: String
//     },

//     color: {
//         type: String
//     },

//     type: {
//         type: String,
//         required: [true, 'Tipo é obrigatório!'],
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
// });



// const Project = mongoose.model('Projects', UserSchema);

// module.exports = Project;