import fastify from "fastify";
import dotenv from "dotenv";
import {AppDb} from "./db/AppDb";
import {AppConf} from "./config/AppConf";
import {Constants} from "./constants";
import authenticationRoutes from "./route/UserRoutes";
import authorRoutes from "./route/AuthorRoutes";
import bookRoutes from "./route/BookRoutes";

declare module 'fastify' {
    interface FastifyRequest {
        user: { id: string };
    }
}

export const app = fastify({
    logger: true,
});

if (process.env.IS_TEST) {
    dotenv.config({ path: ".test.env" });
} else {
    dotenv.config();
}

app.register(authenticationRoutes);
app.register(authorRoutes);
app.register(bookRoutes);

app.get("/health", async (_request, _reply) => {
    return {
        message: Constants.HEALTH_MESSAGE,
    }
});

async function main() {
    try {
        await app.listen({port: AppConf.instance.APP_PORT});
        await AppDb.instance.initializeDatabase();
    } catch (error) {
        app.log.error(error);
    }
}

main().then(result => result);
