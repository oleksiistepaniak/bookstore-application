import fastify from 'fastify';
import dotenv from 'dotenv';
import {AppDb} from "./db/AppDb";
import authenticationRoutes from "./routes/UserRoutes";

export const app = fastify({
    logger: true,
});
dotenv.config();

app.register(authenticationRoutes);

app.get('/health', async (_request, _reply) => {
    return {
        message: 'Everything is working!',
    }
});

async function main() {
    try {
        await app.listen({port: 3000});
        await AppDb.instance.initializeDatabase();
    } catch (error) {
        app.log.error(error);
    }
}

main().then(result => result);
