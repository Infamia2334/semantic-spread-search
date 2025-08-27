import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import type { ISearchAPIRes, ISearchAPIReq } from "../../dto/api.dto.ts";

import type { FastifyPluginAsync } from "fastify";

const fileSearchSchema = {
    consumes: ['multipart/form-data'],
    body: {
        type: 'object',
        properties: {
            metadata: {
                name: { type: 'string' },
                mimetype: { type: 'string' },
                size:  { type: 'number' },
                createdAt: { type: 'string' },
                description: { type: 'string' },
            }
        }
    }
}

const routes: FastifyPluginAsync = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    fastify.post("/search", { schema: fileSearchSchema }, async (req, res): Promise<ISearchAPIRes> => {
        try {
            const data = await req.file();

            data?.filename

            return res.status(201).send({
                status: "Success",
                data: [],
                message: ""
            })            
        } catch (error) {
            return res.status(500).send({
                status: "Success",
                data: [],
                message: "Internal Server Error"
            })    
        }
    });
}

export default routes;
