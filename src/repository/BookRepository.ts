import {ClientSession} from "mongodb";
import {BookModel} from "../model/BookModel";
import {AppDb} from "../db/AppDb";
import {EBookCategory} from "../interfaces";

export class BookRepository {
    private static _instance: BookRepository;

    private constructor() {
    }

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

    async findBooksByCategory(session: ClientSession, category: EBookCategory): Promise<BookModel[]> {
        const db = AppDb.instance;

        const books = await db.booksCollection.find({ category }, { session }).toArray();

        return books.map(it => new BookModel(it));
    }
}
