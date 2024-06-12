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
import {ReplaceBookDto} from "../dto/book/ReplaceBookDto";
import {RemoveBookDto} from "../dto/book/RemoveBookDto";
import {UserRepository} from "../repository/UserRepository";

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

    async createBook(session: ClientSession, dto: CreateBookDto, userId: string): Promise<BookReplyDto> {
        const authorRepo = AuthorRepository.instance;
        const bookRepo = BookRepository.instance;
        const userRepo = UserRepository.instance;

        const userCreator = await userRepo.findUserById(session, new ObjectId(userId));
        check(userCreator, ApiMessages.BOOK.INVALID_USER);

        for (const authorId of dto.authorsIds) {
            const author = await authorRepo.findAuthorById(session, new ObjectId(authorId));
            check(author, ApiMessages.BOOK.AUTHOR_NOT_FOUND);
        }

        const bookModel = BookModel.create(dto, userId);

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
            authorsIds: Array.isArray(dto.authorsIds) ? dto.authorsIds.map(it => new ObjectId(it)) : undefined,
        };

        const books = await bookRepo.findAllBooks(session, filter);
        return books.map(it => it.mapToDto());
    }

    async replaceBook(session: ClientSession, dto: ReplaceBookDto, userId: string): Promise<BookReplyDto> {
        const bookRepo = BookRepository.instance;
        const authorRepo = AuthorRepository.instance;
        const userRepo = UserRepository.instance;

        const userReplacer = await userRepo.findUserById(session, new ObjectId(userId));
        check(userReplacer, ApiMessages.BOOK.INVALID_USER);

        const foundBook = await bookRepo.findBookById(session, new ObjectId(dto.id));
        check(foundBook, ApiMessages.BOOK.BOOK_NOT_FOUND);
        check(foundBook.userCreatorId === userReplacer.id.toString(), ApiMessages.BOOK.INVALID_USER);

        if (dto.title) {
            foundBook.title = dto.title;
        }

        if (dto.description) {
            foundBook.description = dto.description;
        }

        if (dto.numberOfPages) {
            foundBook.numberOfPages = dto.numberOfPages;
        }

        if (dto.category) {
            const category = dto.category as EBookCategory;
            foundBook.category = category;
        }

        if (dto.authorsIds) {
            const authorsIds: ObjectId[] = [];
            for (const authorId of dto.authorsIds) {
                const id = new ObjectId(authorId);
                const foundAuthor = await authorRepo.findAuthorById(session, id);
                if (!foundAuthor) {
                    throw new ApiError(ApiMessages.BOOK.AUTHOR_NOT_FOUND);
                }
                authorsIds.push(id);
            }
            foundBook.authorsIds = authorsIds;
        }

        await bookRepo.replaceBook(session, foundBook);
        return foundBook.mapToDto();
    }

    async removeBook(session: ClientSession, dto: RemoveBookDto): Promise<BookReplyDto> {
        const bookRepo = BookRepository.instance;

        const foundBook = await bookRepo.findBookById(session, new ObjectId(dto.id));
        if (!foundBook) {
            throw new ApiError(ApiMessages.BOOK.BOOK_NOT_FOUND);
        }

        await bookRepo.removeBook(session, foundBook);
        return foundBook.mapToDto();
    }
}
