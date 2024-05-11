import {ClientSession, ObjectId} from "mongodb";
import {CreateBookDto} from "../dto/book/CreateBookDto";
import {AuthorRepository} from "../repository/AuthorRepository";
import {check} from "../util/ApiCheck";
import {ApiMessages} from "../util/ApiMessages";
import {BookRepository, IBookFilter} from "../repository/BookRepository";
import {BookModel} from "../model/BookModel";
import {ApiError} from "../error/ApiError";
import {BookReplyDto} from "../dto/book/BookReplyDto";
import {EBookCategory} from "../interfaces";
import {FindAllBookDto} from "../dto/book/FindAllBookDto";

export class BookService {
    private static _instance: BookService;

    private constructor() {
    }

    public static get instance(): BookService {
        if (!this._instance) {
            this._instance = new BookService();
        }

        return this._instance;
    }

    async createBook(session: ClientSession, dto: CreateBookDto): Promise<BookReplyDto> {
        const authorRepo = AuthorRepository.instance;
        const bookRepo = BookRepository.instance;

        for (const authorId of dto.authorsIds) {
            const author = await authorRepo.findAuthorById(session, new ObjectId(authorId));
            check(Boolean(author), ApiMessages.BOOK.AUTHOR_NOT_FOUND);
        }

        const bookModel = BookModel.create(dto);

        try {
            await bookRepo.createBook(session, bookModel);
        } catch (error) {
            throw new ApiError(ApiMessages.BOOK.CANNOT_CREATE_BOOK);
        }

        return bookModel.mapToDto();
    }

    async findAllBooks(session: ClientSession, dto: FindAllBookDto): Promise<BookReplyDto[]> {
        const bookRepo = BookRepository.instance;

        const filter: IBookFilter = {
            page: dto.page,
            limit: dto.limit,
            title: dto.title,
            description: dto.description,
            minNumberOfPages: dto.minNumberOfPages,
            maxNumberOfPages: dto.maxNumberOfPages,
            category: dto.category ? dto.category as EBookCategory : undefined,
            authorsIds: dto.authorsIds ? dto.authorsIds.map(it => new ObjectId(it)) : undefined,
        };

        const books = await bookRepo.findAllBooks(session, filter);
        return books.map(it => it.mapToDto());
    }
}
