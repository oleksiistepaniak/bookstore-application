import {ClientSession, Collection, Db, MongoClient} from "mongodb";
import {UserRecord} from "./interfaces";
import {app, appConf} from "../index";

export class AppDb {
    private readonly client: MongoClient;
    private readonly db: Db;
    private readonly usersCollection: Collection<UserRecord>;

    constructor() {
        this.client = new MongoClient(appConf.db_url);
        this.db = this.client.db();
        this.usersCollection = this.db.collection("users");
    }

    async withTransaction(callback: (session: ClientSession) => Promise<any>): Promise<any>
    {
        return this.client.withSession(async (session) => {
            return session.withTransaction(async (transactionalSession) => {
                return await callback(transactionalSession);
            });
        });
    }

    async initializeDatabase() {
        try {
            app.log.info(`Connecting to Mongo to URL: ${appConf.db_url}`);
            await this.client.connect();
            await this.usersCollection.createIndex({email: 1}, {unique: true});
            app.log.info(`Connection with Mongo DB successfully established! URL: ${appConf.db_url}`);
        } catch (error) {
            app.log.error(`Attempt to connect to Mongo DB failed!`, error);
            throw error;
        }
    }
}