import {ClientSession} from "mongodb";
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
        await AppDb.instance.authorsCollection.insertOne(author.data, { session });
    }
}
