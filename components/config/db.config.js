import mongoose from 'mongoose';
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
dotenv.config();


const {MONGODB_USER, MONGODB_PASS, MONGODB_PORT} = process.env;
const hostURI = `mongodb://${MONGODB_USER}:${MONGODB_PASS}@localhost:${MONGODB_PORT}`;

const DBConnector = () => {
    return new Promise(
        async (resolve, reject) => {
            try {
                const connector = await mongoose.connect(hostURI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useCreateIndex: true,

                });
                console.log("Connected to DB");
                resolve(connector);
            } catch (e) {
                reject(e);
            }
        }
    );
}

const SessionStore = MongoStore.create({
    mongoUrl: hostURI,
    mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
});

export {DBConnector, SessionStore};