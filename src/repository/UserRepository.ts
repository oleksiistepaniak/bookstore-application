import {ClientSession} from "mongodb";
import {AppDb} from "../db/AppDb";
import {UserModel} from "../model/UserModel";

export class UserRepository {
    private static _instance: UserRepository;

    private constructor() {
    }

    static get instance() {
        if (!this._instance) {
            this._instance = new UserRepository();
        }
        return this._instance;
    }

    async createUser(session: ClientSession, user: UserModel): Promise<void> {
        await AppDb.instance.usersCollection.insertOne(user.data, {session});
    }

}
