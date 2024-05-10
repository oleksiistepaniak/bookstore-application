import {FastifyReply, FastifyRequest} from "fastify";
import {CreateBookDto} from "../dto/book/CreateBookDto";
import {isString, isNumber, check} from "../util/ApiCheck";
import {ApiMessages} from "../util/ApiMessages";
import {Constants} from "../constants";
import {EBookCategory} from "../interfaces";
import {BookReplyDto} from "../dto/book/BookReplyDto";
import {AppDb} from "../db/AppDb";
import {BookService} from "../service/BookService";
import {ApiError} from "../error/ApiError";
import {ObjectId} from "mongodb";

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
            check(Object.keys(EBookCategory).includes(category), ApiMessages.BOOK.INVALID_CATEGORY);
            check(Constants.LATIN_WITH_ONLY_SYMBOLS_REGEXP.test(title), ApiMessages.BOOK.ONLY_LATIN_CHARS_FOR_TITLE);
            check(Constants.LATIN_WITH_ONLY_SYMBOLS_REGEXP.test(description), ApiMessages.BOOK.ONLY_LATIN_CHARS_FOR_DESCRIPTION);

            const dto: BookReplyDto = await AppDb.instance.withTransaction((session) => {
                return BookService.instance.createBook(session, request.body);
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