import fastify from 'fastify';

const app = fastify({
    logger: true,
});

app.get('/', async (_request, _reply) => {
    return {
        message: 'Hello world!',
    }
});

async function main() {
    try {
        await app.listen({port: 3000});
    } catch (error) {
        app.log.error(error);
    }
}

main().then(result => result);