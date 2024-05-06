import {FastifyReply} from "fastify";
import {ApiMessages} from "../util/ApiMessages";
import jwt from "jsonwebtoken";
import {AppConf} from "../config/AppConf";
import {TUserRequest} from "../interfaces";

export const authenticationMiddleware = (request: TUserRequest, reply: FastifyReply) => {
    const conf = AppConf.instance;
    if (!request.headers.authorization) {
        reply.status(401).send({
            message: ApiMessages.AUTH_MIDDLEWARE.TOKEN_NOT_PROVIDED,
        });
        return;
    }

    const token = request.headers.authorization.split(" ")[1];

    try {
        const decoded = jwt.verify(token, conf.JWT_SECRET);
        request.user = {id: decoded.toString()};
    } catch (error) {
        reply.status(401).send({
            message: ApiMessages.AUTH_MIDDLEWARE.INVALID_TOKEN,
        });
        return;
    }
}