import mongoose from 'mongoose';
import debug from 'debug';

const log = debug('app:mongoose-service');

class MongooseService {
    count = 0;
    mongooseOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
    };

    constructor() {
        this.connectWithRetry();
    }

    getMongoose() {
        return mongoose;
    }

    connectWithRetry = () => {
        log('Attempting MongoDB connection (will retry if needed)');
        mongoose
            .connect(process.env.MONGO_URI ?? 'mongodb://localhost:27017/api-db', this.mongooseOptions)
            .then(async () => {
                console.log(' DB connected successfully');
                // if (process.env.DEBUG) { 
                //     await Pool.deleteMany(); // Clear existing data
                //     await Pool.insertMany(poolsData); // Seed with new data
                //     console.log('Seed data inserted');
                // }
            })
            .catch((err) => {
                const retrySeconds = 5;
                // log(
                //     `MongoDB connection unsuccessful (will retry #${++this
                //         .count} after ${retrySeconds} seconds):`,
                //     err
                // );
                log("MongoDB connection unsuccessful");
                log(err);
                // setTimeout(this.connectWithRetry, retrySeconds * 1000);
            });
    };
}

export default new MongooseService();