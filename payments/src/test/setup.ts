import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { app } from '../app';

declare global {
    namespace NodeJS {
        interface Global {
            signin(id?: string): string[];
        }
    }
}

jest.mock('../nats-wrapper');

process.env.STRIPE_KEY = 'sk_test_51IZuJgCf2MAz9dLP4g3PoUW7M5CsZ1EpAS4QCp14KjzgHEHYFbMFpRqE6181lcxZXqSA3nM4nOpchkzMtPZ2ta4s00xqoRA8ht';

let mongo: any;

beforeAll(async () => {
    process.env.JWT_KEY = 'asdfdsa';

    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for(let collection of collections){
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.signin = (id?: string) => {
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com',
    };
    const token = jwt.sign(payload, process.env.JWT_KEY!);
    const session = { jwt: token };
    const sessionJSON = JSON.stringify(session);
    const base64 = Buffer.from(sessionJSON).toString('base64');

    return [`express:sess=${base64}`];
}