import {FastifyReply, FastifyRequest} from "fastify";
import {CreateAuthorDto} from "../dto/author/CreateAuthorDto";
import {check, isOptionalNumber, isOptionalString, isString} from "../util/ApiCheck";
import {ApiMessages} from "../util/ApiMessages";
import {Constants} from "../constants";
import {AuthorReplyDto} from "../dto/author/AuthorReplyDto";
import {AppDb} from "../db/AppDb";
import {AuthorService} from "../service/AuthorService";
import {ApiError} from "../error/ApiError";
import {ENationality} from "../interfaces";
import {FindAllAuthorDto} from "../dto/author/FindAllAuthorDto";
import {ReplaceAuthorDto} from "../dto/author/ReplaceAuthorDto";
import {ObjectId} from "mongodb";

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

    async findAllAuthors(request: FastifyRequest<{ Body: FindAllAuthorDto }>, reply: FastifyReply): Promise<void> {
        try {
            const { page, limit, name, surname, nationality, biography } = request.body;

            isOptionalNumber(page, ApiMessages.AUTHOR.PAGE_NOT_NUMBER);
            isOptionalNumber(limit, ApiMessages.AUTHOR.LIMIT_NOT_NUMBER);
            isOptionalString(name, ApiMessages.AUTHOR.NAME_NOT_STRING);
            isOptionalString(surname, ApiMessages.AUTHOR.SURNAME_NOT_STRING);
            isOptionalString(nationality, ApiMessages.AUTHOR.NATIONALITY_NOT_STRING);
            isOptionalString(biography, ApiMessages.AUTHOR.BIOGRAPHY_NOT_STRING);

            const dtos: AuthorReplyDto[] = await AppDb.instance.withTransaction((session) => {
                return AuthorService.instance.findAllAuthors(session, request.body);
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

    async replaceAuthor(request: FastifyRequest<{ Body: ReplaceAuthorDto }>, reply: FastifyReply): Promise<void> {
        try {
            const { id, surname, name, nationality, biography } = request.body;

            isOptionalString(name, ApiMessages.AUTHOR.NAME_NOT_STRING);
            isOptionalString(surname, ApiMessages.AUTHOR.SURNAME_NOT_STRING);
            isOptionalString(nationality, ApiMessages.AUTHOR.NATIONALITY_NOT_STRING);
            isOptionalString(biography, ApiMessages.AUTHOR.BIOGRAPHY_NOT_STRING);
            check(ObjectId.isValid(id), ApiMessages.AUTHOR.INVALID_AUTHOR_ID);
            check(Boolean(name || surname || nationality || biography), ApiMessages.AUTHOR.INVALID_AUTHOR_REPLACING);

            if (name) {
                check(name.length >= Constants.AUTHOR.MIN_NAME_LENGTH
                    && name.length <= Constants.AUTHOR.MAX_NAME_LENGTH, ApiMessages.AUTHOR.INVALID_NAME_LENGTH);
                check(Constants.LATIN_ONLY_REGEXP.test(name), ApiMessages.AUTHOR.ONLY_LATIN_CHARS_FOR_NAME);
            }

            if (surname) {
                check(surname.length >= Constants.AUTHOR.MIN_SURNAME_LENGTH
                    && surname.length <= Constants.AUTHOR.MAX_SURNAME_LENGTH, ApiMessages.AUTHOR.INVALID_SURNAME_LENGTH);
                check(Constants.LATIN_ONLY_REGEXP.test(surname), ApiMessages.AUTHOR.ONLY_LATIN_CHARS_FOR_SURNAME);
            }

            if (nationality) {
                check(Object.keys(ENationality).includes(nationality.toUpperCase()), ApiMessages.AUTHOR.INVALID_NATIONALITY);
            }

            if (biography) {
                check(biography.length >= Constants.AUTHOR.MIN_BIOGRAPHY_LENGTH
                    && biography.length <= Constants.AUTHOR.MAX_BIOGRAPHY_LENGTH, ApiMessages.AUTHOR.INVALID_BIOGRAPHY_LENGTH);
                check(Constants.LATIN_WITH_ONLY_SYMBOLS_REGEXP.test(biography), ApiMessages.AUTHOR.ONLY_LATIN_CHARS_FOR_BIOGRAPHY);
            }

            const dto: AuthorReplyDto = await AppDb.instance.withTransaction((session) => {
                return AuthorService.instance.replaceAuthor(session, request.body);
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
}
