import type { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import type { ISearchAPIRes, ISearchAPIReq, IMetadata } from "../../dto/api.dto.ts";

import type { FastifyPluginAsync } from "fastify";
import FileParser from "../../services/parserService.ts";
import { ApiError } from "../../customError/apiError.ts";
import type { MultipartFile } from "@fastify/multipart";
import { formatContextForLLM } from "../../utils/formatter.ts";

// const fileSearchSchema = {
//     consumes: ['multipart/form-data'],
//    body: {
//         type: 'object',
//         properties: {
//                 type: 'object',
//                 properties: {
//                     name: { type: 'string' },
//                     mimetype: { type: 'string' },
//                     size:  { type: 'number' },
//                     createdAt: { type: 'string' },
//                     description: { type: 'string' },
//                 },
//             }
//         },
// }

const routes: FastifyPluginAsync = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    fastify.post("/search", async (req: FastifyRequest, res): Promise<ISearchAPIRes> => {
        try {
            const { file , name, mimetype, size, createdAt, description} = req.body as any;
            const metadata = {
                name,
                mimetype,
                size,
                createdAt,
                description,
            }
            console.log(file);
            // if (!data) {
            //     const apiError = new ApiError(400, 'Bad Request');
            //     throw apiError;
            // }
            const parserService = new FileParser(file, metadata);
            const parsedFile = await parserService.parseSheet();

            const data = formatContextForLLM(parsedFile);

            return res.status(201).send({
                status: "Success",
                data,
                message: ""
            })            
        } catch (error: any) {
            if (error instanceof ApiError) {
                return res.status(error.code).send(error);
            }
            return res.status(500).send({
                status: "Success",
                data: [],
                message: "Internal Server Error"
            })    
        }
    });
}

export default routes;
