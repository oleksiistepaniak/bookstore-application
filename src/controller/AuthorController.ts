import {FastifyReply, FastifyRequest} from "fastify";
import {CreateAuthorDto} from "../dto/author/CreateAuthorDto";
import {check, isString} from "../util/ApiCheck";
import {ApiMessages} from "../util/ApiMessages";
import {Constants} from "../constants";
import {AuthorReplyDto} from "../dto/author/AuthorReplyDto";
import {AppDb} from "../db/AppDb";
import {AuthorService} from "../service/AuthorService";
import {ApiError} from "../error/ApiError";
import {ENationality} from "../interfaces";
import {NationalityDto} from "../dto/author/NationalityDto";

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

    async createAuthor(request: FastifyRequest<{ Body: CreateAuthorDto}>, reply: FastifyReply): Promise<void> {
        try {
            const { name, surname, nationality, biography } = request.body;

            isString(name, ApiMessages.AUTHOR.NAME_NOT_STRING);
            isString(surname, ApiMessages.AUTHOR.SURNAME_NOT_STRING);
            isString(nationality, ApiMessages.AUTHOR.NATIONALITY_NOT_STRING);
            isString(biography, ApiMessages.AUTHOR.BIOGRAPHY_NOT_STRING);
            check(name.length >= Constants.AUTHOR.MIN_NAME_LENGTH
                && name.length <= Constants.AUTHOR.MAX_NAME_LENGTH, ApiMessages.AUTHOR.INVALID_NAME_LENGTH);
            check(surname.length >= Constants.AUTHOR.MIN_SURNAME_LENGTH
                && surname.length <= Constants.AUTHOR.MAX_SURNAME_LENGTH, ApiMessages.AUTHOR.INVALID_SURNAME_LENGTH);
            check(biography.length >= Constants.AUTHOR.MIN_BIOGRAPHY_LENGTH
                && biography.length <= Constants.AUTHOR.MAX_BIOGRAPHY_LENGTH, ApiMessages.AUTHOR.INVALID_BIOGRAPHY_LENGTH);
            check(Constants.LATIN_ONLY_REGEXP.test(name), ApiMessages.AUTHOR.ONLY_LATIN_CHARS_FOR_NAME);
            check(Constants.LATIN_ONLY_REGEXP.test(surname), ApiMessages.AUTHOR.ONLY_LATIN_CHARS_FOR_SURNAME);
            check(Constants.LATIN_WITH_ONLY_SYMBOLS_REGEXP.test(biography), ApiMessages.AUTHOR.ONLY_LATIN_CHARS_FOR_BIOGRAPHY);
            check(Object.keys(ENationality).includes(nationality.toUpperCase()), ApiMessages.AUTHOR.INVALID_NATIONALITY);

            const dto: AuthorReplyDto = await AppDb.instance.withTransaction((session) => {
                return AuthorService.instance.createAuthor(session, request.body);
            });

            reply.status(200).send(dto);
        } catch (error) {
            const apiError = error as ApiError;
            reply.status(400).send({
                message: apiError.message,
            });
            return;
        }
    }

    async findAuthorsByNationality(request: FastifyRequest<{ Body: NationalityDto }>, reply: FastifyReply): Promise<void> {
        try {
            const {nationality} = request.body;

            isString(nationality, ApiMessages.AUTHOR.NATIONALITY_NOT_STRING);
            check(Object.keys(ENationality).includes(nationality.toUpperCase()), ApiMessages.AUTHOR.INVALID_NATIONALITY);

            const dtos: AuthorReplyDto[] = await AppDb.instance.withTransaction((session) => {
                return AuthorService.instance.findAuthorsByNationality(session, request.body);
            });

            reply.status(200).send(dtos);
        } catch (error) {
            const apiError = error as ApiError;
            reply.status(400).send({
                message: apiError.message,
            });
            return;
        }
    }

    async findAllAuthors(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const dtos: AuthorReplyDto[] = await AppDb.instance.withTransaction((session) => {
                return AuthorService.instance.findAllAuthors(session);
            });

            reply.status(200).send(dtos);
        } catch (error) {
            const apiError = error as ApiError;
            reply.status(400).send({
                message: apiError.message,
            });
            return;
        }
    }
}
