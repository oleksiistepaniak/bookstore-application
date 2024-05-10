import {ClientSession} from "mongodb";
import {AppDb} from "../db/AppDb";
import {UserModel} from "../model/UserModel";

export class UserRepository {
    private static _instance: UserRepository;

    private constructor() {
    }

    public static get instance() {
        if (!this._instance) {
            this._instance = new UserRepository();
        }
        return this._instance;
    }

    async createUser(session: ClientSession, user: UserModel): Promise<void> {
        const db = AppDb.instance;

        await db.usersCollection.insertOne(user.data, {session});
    }

    async findUserByEmail(session: ClientSession, email: string): Promise<UserModel | null> {
        const db = AppDb.instance;

        const user = await db.usersCollection.findOne({email}, {session});

        return user ? new UserModel(user) : null;
    }
}
