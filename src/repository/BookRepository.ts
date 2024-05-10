import {ClientSession} from "mongodb";
import {BookModel} from "../model/BookModel";
import {AppDb} from "../db/AppDb";

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
}
