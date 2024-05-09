import {FastifyReply, FastifyRequest} from "fastify";
import {CreateAuthorDto} from "../dto/author/CreateAuthorDto";
import {check, isString} from "../util/ApiCheck";
import {ApiMessages} from "../util/ApiMessages";
import {Constants} from "../constants";
import {AuthorReplyDto} from "../dto/author/AuthorReplyDto";
import {AppDb} from "../db/AppDb";
import {AuthorService} from "../service/AuthorService";
import {ApiError} from "../error/ApiError";

export class AuthorController {
    private static _instance: AuthorController;

    private constructor() {
    }

    public static get instance(): AuthorController {
        if (!this._instance) {
            this._instance = new AuthorController();
        }
        return this._instance;
    }

    async createAuthor(request: FastifyRequest<{ Body: CreateAuthorDto}>, reply: FastifyReply) {
        try {
            const { name, surname } = request.body;

            isString(name, ApiMessages.AUTHOR.NAME_NOT_STRING);
            isString(surname, ApiMessages.AUTHOR.SURNAME_NOT_STRING);
            check(name.length >= Constants.AUTHOR.MIN_NAME_LENGTH
                && name.length <= Constants.AUTHOR.MAX_NAME_LENGTH, ApiMessages.AUTHOR.INVALID_NAME_LENGTH);
            check(surname.length >= Constants.AUTHOR.MIN_SURNAME_LENGTH
                && surname.length <= Constants.AUTHOR.MAX_SURNAME_LENGTH, ApiMessages.AUTHOR.INVALID_SURNAME_LENGTH);
            check(Constants.LATIN_ONLY_REGEXP.test(name), ApiMessages.AUTHOR.ONLY_LATIN_CHARS_FOR_NAME);
            check(Constants.LATIN_ONLY_REGEXP.test(surname), ApiMessages.AUTHOR.ONLY_LATIN_CHARS_FOR_SURNAME);

            const dto: AuthorReplyDto = await AppDb.instance.withTransaction((session) => {
                return AuthorService.instance.createAuthor(session, request.body);
            });

            reply.status(200).send(dto);
        } catch (error) {
            const apiError = error as ApiError;
            reply.status(400).send({
                message: apiError.message,
            });
        }
    }
}