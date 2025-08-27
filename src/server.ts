import Fastify from 'fastify';
import getConfig from './config/config.ts';
import apiV1 from './api/v1/index.ts';
import fastifyMultipart from '@fastify/multipart';

const fastify = Fastify({
    logger: true,
});

fastify.register(fastifyMultipart, {
    attachFieldsToBody: 'keyValues',
});

fastify.get("/health", () => {
    return "Server is Healthy";
});

fastify.register(apiV1, { prefix: '/api/v1' });

const PORT = getConfig().PORT;

fastify.listen({ port: PORT }, async (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});
