import {FastifyReply, FastifyRequest} from "fastify";
import {ApiMessages} from "../util/ApiMessages";
import jwt, {JwtPayload} from "jsonwebtoken";
import {AppConf} from "../config/AppConf";

export type TJwtPayload = JwtPayload & { user: string };

export const authenticationMiddleware = (request: FastifyRequest, reply: FastifyReply, next: (error?: Error) => void) => {
    const conf = AppConf.instance;
    if (!request.headers.authorization) {
        reply.status(401).send({
            message: ApiMessages.AUTH_MIDDLEWARE.TOKEN_NOT_PROVIDED,
        });
        return;
    }

    const token = request.headers.authorization.split(" ")[1];

    try {
        const decoded = jwt.verify(token, conf.JWT_SECRET) as TJwtPayload;
        request.user = {id: decoded.user };
        next();
    } catch (error) {
        reply.status(401).send({
            message: ApiMessages.AUTH_MIDDLEWARE.INVALID_TOKEN,
        });
        return;
    }
}
