import {ClientSession, ObjectId} from "mongodb";
import {AuthorModel} from "../model/AuthorModel";
import {AppDb} from "../db/AppDb";
import {ENationality} from "../interfaces";

export interface IAuthorFilter {
    page?: number;
    limit?: number;
    name?: string;
    surname?: string;
    biography?: string;
    nationality?: ENationality;
}

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

    async findAllAuthors(session: ClientSession, filter: IAuthorFilter): Promise<AuthorModel[]> {
        const db = AppDb.instance;
        const page = filter.page ?? 1;
        const limit = filter.limit ?? 10;

        const skip = (page - 1) * limit;

        const query: any = {};

        if (filter.name) {
            query.name = { $regex: `.*${filter.name}.*`, $options: "i" };
        }

        if (filter.surname) {
            query.surname = { $regex: `.*${filter.surname}.*`, $options: "i" };
        }

        if (filter.biography) {
            query.biography = { $regex: `.*${filter.biography}.*`, $options: "i" };
        }

        if (filter.nationality) {
            query.nationality = filter.nationality;
        }

        const authors = await db.authorsCollection.find(query, { session })
            .skip(skip)
            .limit(limit)
            .toArray();

        return authors.map(it => new AuthorModel(it));
    }

    async replaceAuthor(session: ClientSession, author: AuthorModel): Promise<void> {
        const db = AppDb.instance;

        await db.authorsCollection.replaceOne({_id: author.id}, author.data, { session });
    }
}
