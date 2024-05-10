import {ClientSession, ObjectId} from "mongodb";
import {AuthorModel} from "../model/AuthorModel";
import {AppDb} from "../db/AppDb";
import {ENationality} from "../interfaces";

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

    async findAuthorsByNationality(session: ClientSession, nationality: ENationality): Promise<AuthorModel[]> {
        const db = AppDb.instance;

        const authors = await db.authorsCollection.find({ nationality }, { session }).toArray();

        return authors.map(it => new AuthorModel(it));
    }

    async findAllAuthors(session: ClientSession): Promise<AuthorModel[]> {
        const db = AppDb.instance;

        const authors = await db.authorsCollection.find({}, { session }).toArray();

        return authors.map(it => new AuthorModel(it));
    }
}
