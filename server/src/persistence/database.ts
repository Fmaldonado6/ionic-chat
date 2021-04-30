import { connect } from 'mongoose';

class MongodbConnection {

    public async connect() {
        try {
            await connect(process.env.DB_CONNECTION as string, {
                useNewUrlParser: true,
                useFindAndModify:false,
                useUnifiedTopology: true
            })
            console.log("MongoDB connected")
            return true;

        } catch {
            console.log("MongoDB failed")
            return false;
        }

    }

}

export const mongodbConnection = new MongodbConnection();