import {ClientSession, ObjectId} from "mongodb";
import {BookModel} from "../model/BookModel";
import {AppDb} from "../db/AppDb";
import {EBookCategory} from "../interfaces";

export interface IBookFilter {
    page?: number;
    limit?: number;
    title?: string;
    description?: string;
    minNumberOfPages?: number;
    maxNumberOfPages?: number;
    category?: EBookCategory;
    authorsIds?: ObjectId[];
}

export class BookRepository {
    private static _instance: BookRepository;

    private constructor() {
    }

    // TODO: all singletons as a replacer of DI should be altered using other solution
    public static get instance(): BookRepository {
        if (!this._instance) {
            this._instance = new BookRepository();
        }

        return this._instance;
    }

    async createBook(session: ClientSession, book: BookModel): Promise<void> {
        const db = AppDb.instance;

        await db.booksCollection.insertOne(book.data, { session });
    }

    async findBookById(session: ClientSession, id: ObjectId): Promise<BookModel | null> {
        const db = AppDb.instance;

        const book = await db.booksCollection.findOne({ _id: id }, { session });

        return book ? new BookModel(book) : null;
    }

    async findAllBooks(session: ClientSession, filter: IBookFilter): Promise<BookModel[]> {
        const db = AppDb.instance;
        const limit = filter.limit ?? 10;
        const page = filter.page ?? 1;
        const skip = (page - 1) * limit;

        const query: any = {};

        if (filter.title) {
            query.title = { $regex: `.*${filter.title}.*`, $options: "i" };
        }

        if (filter.description) {
            query.description = { $regex: `.*${filter.description}.*`, $options: "i" };
        }

        if (filter.minNumberOfPages && filter.maxNumberOfPages) {
            query.numberOfPages = { $gte: filter.minNumberOfPages, $lte: filter.maxNumberOfPages };
        } else if (filter.minNumberOfPages) {
            query.numberOfPages = { $gte: filter.minNumberOfPages };
        } else if (filter.maxNumberOfPages) {
            query.numberOfPages = { $lte: filter.maxNumberOfPages };
        }

        if (filter.category) {
            query.category = filter.category;
        }

        if (filter.authorsIds && filter.authorsIds.length !== 0) {
            query.authorsIds = { $in: filter.authorsIds };
        }

        const books = await db.booksCollection.find(query, { session })
            .skip(skip)
            .limit(limit)
            .toArray();

        return books.map(it => new BookModel(it));
    }

    async replaceBook(session: ClientSession, book: BookModel): Promise<void> {
        const db = AppDb.instance;

        await db.booksCollection.replaceOne({ _id: book.id }, book.data, { session });
    }

    async removeBook(session: ClientSession, book: BookModel): Promise<void> {
        const db = AppDb.instance;

        await db.booksCollection.deleteOne({_id: book.id}, { session });
    }
}
