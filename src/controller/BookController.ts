import {FastifyReply, FastifyRequest} from "fastify";
import {CreateBookDto} from "../dto/book/CreateBookDto";
import {isString, isNumber, check, isOptionalNumber, isOptionalString, isOptionalArray} from "../util/ApiCheck";
import {ApiMessages} from "../util/ApiMessages";
import {Constants} from "../constants";
import {EBookCategory} from "../interfaces";
import {BookReplyDto} from "../dto/book/BookReplyDto";
import {AppDb} from "../db/AppDb";
import {BookService} from "../service/BookService";
import {ApiError} from "../error/ApiError";
import {ObjectId} from "mongodb";
import {FindAllBookDto} from "../dto/book/FindAllBookDto";
import {ReplaceBookDto} from "../dto/book/ReplaceBookDto";
import {RemoveBookDto} from "../dto/book/RemoveBookDto";

export class BookController {
    private static _instance: BookController;

    private constructor() {
    }

    public static get instance(): BookController {
        if (!this._instance) {
            this._instance = new BookController();
        }

        return this._instance;
    }

    async createBook(request: FastifyRequest<{ Body: CreateBookDto }>, reply: FastifyReply): Promise<void> {
        try {
            const { title, description, category, numberOfPages, authorsIds } = request.body;

            isString(title, ApiMessages.BOOK.TITLE_NOT_STRING);
            isString(description, ApiMessages.BOOK.DESCRIPTION_NOT_STRING);
            isString(category, ApiMessages.BOOK.CATEGORY_NOT_STRING);
            check(Boolean(authorsIds), ApiMessages.BOOK.INVALID_AUTHORS_IDS_ARRAY);
            for (const authorId of authorsIds) {
                isString(authorId, ApiMessages.BOOK.AUTHOR_ID_NOT_STRING);
                check(ObjectId.isValid(authorId), ApiMessages.BOOK.INVALID_AUTHOR_ID);
            }
            isNumber(numberOfPages, ApiMessages.BOOK.NUMBER_OF_PAGES_NOT_NUMBER);
            check(title.length >= Constants.BOOK.MIN_TITLE_LENGTH
                && title.length <= Constants.BOOK.MAX_TITLE_LENGTH, ApiMessages.BOOK.INVALID_TITLE_LENGTH);
            check(description.length >= Constants.BOOK.MIN_DESCRIPTION_LENGTH
                && description.length <= Constants.BOOK.MAX_DESCRIPTION_LENGTH, ApiMessages.BOOK.INVALID_DESCRIPTION_LENGTH);
            check(numberOfPages >= Constants.BOOK.MIN_NUMBER_OF_PAGES
                && numberOfPages <= Constants.BOOK.MAX_NUMBER_OF_PAGES, ApiMessages.BOOK.INVALID_NUMBER_OF_PAGES);
            check(Constants.LATIN_WITH_ONLY_SYMBOLS_REGEXP.test(title), ApiMessages.BOOK.ONLY_LATIN_CHARS_FOR_TITLE);
            check(Constants.LATIN_WITH_ONLY_SYMBOLS_REGEXP.test(description), ApiMessages.BOOK.ONLY_LATIN_CHARS_FOR_DESCRIPTION);
            check(Object.keys(EBookCategory).includes(category.toUpperCase()), ApiMessages.BOOK.INVALID_CATEGORY);

            const dto: BookReplyDto = await AppDb.instance.withTransaction((session) => {
                return BookService.instance.createBook(session, request.body, request.user.id);
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

    async findAllBooks(request: FastifyRequest<{ Body: FindAllBookDto }>, reply: FastifyReply): Promise<void> {
        try {
            const { page, limit, title, description, minNumberOfPages, maxNumberOfPages, category, authorsIds } = request.body;

            isOptionalNumber(page, ApiMessages.BOOK.PAGE_NOT_NUMBER);
            isOptionalNumber(limit, ApiMessages.BOOK.LIMIT_NOT_NUMBER);
            isOptionalNumber(minNumberOfPages, ApiMessages.BOOK.MIN_NUMBER_OF_PAGES_NOT_NUMBER);
            isOptionalNumber(maxNumberOfPages, ApiMessages.BOOK.MAX_NUMBER_OF_PAGES_NOT_NUMBER);
            isOptionalString(title, ApiMessages.BOOK.TITLE_NOT_STRING);
            isOptionalString(description, ApiMessages.BOOK.DESCRIPTION_NOT_STRING);
            isOptionalString(category, ApiMessages.BOOK.CATEGORY_NOT_STRING);
            isOptionalArray(authorsIds, ApiMessages.BOOK.INVALID_AUTHORS_IDS_ARRAY);
            if (authorsIds && Array.isArray(authorsIds)) {
                for (const authorId of authorsIds) {
                    isString(authorId, ApiMessages.BOOK.AUTHOR_ID_NOT_STRING);
                    check(ObjectId.isValid(authorId), ApiMessages.BOOK.INVALID_AUTHOR_ID);
                }
            }

            const dtos: BookReplyDto[] = await AppDb.instance.withTransaction((session) => {
                return BookService.instance.findAllBooks(session, request.body);
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

    async replaceBook(request: FastifyRequest<{ Body: ReplaceBookDto }>, reply: FastifyReply): Promise<void> {
        try {
            const { id, title, description, numberOfPages, category, authorsIds } = request.body;

            isOptionalString(title, ApiMessages.BOOK.TITLE_NOT_STRING);
            isOptionalString(description, ApiMessages.BOOK.DESCRIPTION_NOT_STRING);
            isOptionalString(category, ApiMessages.BOOK.CATEGORY_NOT_STRING);
            isOptionalNumber(numberOfPages, ApiMessages.BOOK.NUMBER_OF_PAGES_NOT_NUMBER);
            check(ObjectId.isValid(id), ApiMessages.BOOK.INVALID_BOOK_ID);
            check(Boolean(title || description || numberOfPages || category || authorsIds),
                ApiMessages.BOOK.INVALID_BOOK_REPLACING);

            if (title) {
                check(title.length >= Constants.BOOK.MIN_TITLE_LENGTH
                    && title.length <= Constants.BOOK.MAX_TITLE_LENGTH, ApiMessages.BOOK.INVALID_TITLE_LENGTH);
                check(Constants.LATIN_WITH_ONLY_SYMBOLS_REGEXP.test(title), ApiMessages.BOOK.ONLY_LATIN_CHARS_FOR_TITLE);
            }

            if (description) {
                check(description.length >= Constants.BOOK.MIN_DESCRIPTION_LENGTH
                    && description.length <= Constants.BOOK.MAX_DESCRIPTION_LENGTH, ApiMessages.BOOK.INVALID_DESCRIPTION_LENGTH);
                check(Constants.LATIN_WITH_ONLY_SYMBOLS_REGEXP.test(description), ApiMessages.BOOK.ONLY_LATIN_CHARS_FOR_DESCRIPTION);
            }

            if (category) {
                check(Object.keys(EBookCategory).includes(category.toUpperCase()), ApiMessages.BOOK.INVALID_CATEGORY);
            }

            if (numberOfPages) {
                check(numberOfPages >= Constants.BOOK.MIN_NUMBER_OF_PAGES
                    && numberOfPages <= Constants.BOOK.MAX_NUMBER_OF_PAGES, ApiMessages.BOOK.INVALID_NUMBER_OF_PAGES);
            }

            if (authorsIds) {
                for (const authorId of authorsIds) {
                    isString(authorId, ApiMessages.BOOK.AUTHOR_ID_NOT_STRING);
                    check(ObjectId.isValid(authorId), ApiMessages.BOOK.INVALID_AUTHOR_ID);
                }
            }

            const dto: BookReplyDto = await AppDb.instance.withTransaction((session) => {
                return BookService.instance.replaceBook(session, request.body, request.user.id);
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

    async removeBook(request: FastifyRequest<{ Body: RemoveBookDto }>, reply: FastifyReply): Promise<void> {
        try {
            const { id } = request.body;

            check(ObjectId.isValid(id), ApiMessages.BOOK.INVALID_BOOK_ID);

            const dto: BookReplyDto = await AppDb.instance.withTransaction((session) => {
                return BookService.instance.removeBook(session, request.body);
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
