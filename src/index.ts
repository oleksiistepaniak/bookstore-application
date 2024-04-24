import fastify from 'fastify';
import dotenv from 'dotenv';
import {AppConf} from "./config/AppConf";
import {AppDb} from "./db/AppDb";

export const app = fastify({
    logger: true,
});

dotenv.config();

export const appConf = new AppConf();
export const appDb = new AppDb();

app.get('/', async (_request, _reply) => {
    return {
        message: 'Hello world!',
    }
});

async function main() {
    try {
        await app.listen({port: 3000});
        await appDb.initializeDatabase();
    } catch (error) {
        app.log.error(error);
    }
}

main().then(result => result);