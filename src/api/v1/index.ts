import type {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRequest,
} from "fastify";
import type { ISearchAPIRes } from "../../dto/api.dto.ts";
import type { FastifyPluginAsync } from "fastify";
import FileParser from "../../services/parserService.ts";
import { ApiError } from "../../customError/apiError.ts";
import LLMService from "../../services/llmService.ts";
import getConfig from "../../config/config.ts";

const routes: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.post(
    "/search",
    async (req: FastifyRequest, res): Promise<ISearchAPIRes> => {
      try {
        const { file, name, search, mimetype, size, createdAt, description } =
          req.body as any;
        const metadata = {
          name,
          mimetype,
          size,
          createdAt,
          description,
        };

        if (!file || !search || !mimetype) {
          const apiError = new ApiError(400, "Bad Request");
          throw apiError;
        }
        const parserService = new FileParser(file, metadata);
        const sheetsContext = await parserService.parseSheet();

        const llmService = new LLMService(getConfig().GEMINI_API_KEY as string);
        const data = await llmService.generateSemanticSearch(
          sheetsContext,
          search
        );

        return res.status(201).send({
          status: "Success",
          data,
          message: "Successfully searched the spreadsheet",
        });
      } catch (error: any) {
        if (error instanceof ApiError) {
          return res.status(error.code).send(error);
        }
        return res.status(500).send({
          status: "Success",
          data: [],
          message: "Internal Server Error",
        });
      }
    }
  );
};

export default routes;
