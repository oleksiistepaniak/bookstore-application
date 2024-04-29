import {ClientSession, Collection, Db, MongoClient} from "mongodb";
import {UserRecord} from "./interfaces";
import {app} from "../index";
import {AppConf} from "../config/AppConf";
import {ApiMessages} from "../util/ApiMessages";

export class AppDb {
    private static _instance: AppDb;
    private readonly _client: MongoClient;
    private readonly _db: Db;
    private readonly _usersCollection: Collection<UserRecord>;

    private constructor() {
        this._client = new MongoClient(AppConf.instance.DB_URL);
        this._db = this._client.db();
        this._usersCollection = this._db.collection("users");
    }

    public static get instance(): AppDb {
        if (!this._instance) {
            this._instance = new AppDb();
        }
        return this._instance;
    }

    get usersCollection(): Collection<UserRecord> {
        return this._usersCollection;
    }

    async withTransaction(callback: (session: ClientSession) => Promise<any>): Promise<any>
    {
        return this._client.withSession(async (session) => {
            return session.withTransaction(async (transactionalSession) => {
                return await callback(transactionalSession);
            });
        });
    }

    async initializeDatabase() {
        try {
            app.log.info(`Connecting to Mongo to URL: ${AppConf.instance.DB_URL}`);
            await this._client.connect();
            await this._usersCollection.createIndex({email: 1}, {unique: true});
            app.log.info(`Connection with Mongo DB successfully established! URL: ${AppConf.instance.DB_URL}`);
        } catch (error) {
            app.log.error(`Attempt to connect to Mongo DB failed!`, error);
            throw new Error(ApiMessages.MONGO_CONNECTION_FAILED);
        }
    }
}
