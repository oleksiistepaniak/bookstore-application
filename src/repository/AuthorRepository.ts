import {ClientSession, ObjectId} from "mongodb";
import {AuthorModel} from "../model/AuthorModel";
import {AppDb} from "../db/AppDb";

export class AuthorRepository {
    private static _instance: AuthorRepository;

    private constructor() {
    }

    public static get instance() {
        if (!this._instance) {
            this._instance = new AuthorRepository();
        }
        return this._instance;
    }

    async createAuthor(session: ClientSession, author: AuthorModel): Promise<void> {
        const db = AppDb.instance;

        await db.authorsCollection.insertOne(author.data, { session });
    }

    async findAuthorById(session: ClientSession, id: ObjectId): Promise<AuthorModel | null> {
        const db = AppDb.instance;

        const author = await db.authorsCollection.findOne({ _id: id }, { session });

        return author ? new AuthorModel(author) : null;
    }
}
