const dotenv = require('dotenv'); // To use .env param
const mongoose = require('mongoose');
//const { MongoClient } = require("mongodb");

dotenv.config();

exports.initMongodb = async() => {
    try {
        await mongoose.connect('mongodb://' + process.env.MONGO_USERNAME + ':' + encodeURIComponent(process.env.MONGO_PASSWORD) + '@' + process.env.MONGO_HOST + '/' + process.env.MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("DB connected at", process.env.MONGO_HOST)
    } catch (e) {
        console.error(e);
        process.exit(1)
    }
    // try {
    //     const dbClient = new MongoClient('mongodb://' + process.env.MONGO_USERNAME + ':' + encodeURIComponent(process.env.MONGO_PASSWORD) + '@' + process.env.MONGO_HOST + '/' + process.env.MONGO_DB, { 
    //         useNewUrlParser: true,    
    //         useUnifiedTopology: true 
    //     });

    //     await dbClient.connect();
    //     let db = await dbClient.db(process.env.MONGO_DB);
    //     db.command({ ping: 1 });
    //     console.log("Connected successfully to MongoDB");

    //     return db;
    // } catch (e) {
    //     console.error(e);
    //     process.exit(1)
    // }
}
