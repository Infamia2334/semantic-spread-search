import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import type { ISearchAPIRes } from "../../dto/api.dto.ts";

import type { FastifyPluginAsync } from "fastify";

const routes: FastifyPluginAsync = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {

    fastify.post("/", async (req, res): Promise<ISearchAPIRes> => {
        const data = await req.file();

        data?.filename

        return res.send({
            status: "Success",
            data: [],
            message: ""
        })
    })
}

export default routes;
