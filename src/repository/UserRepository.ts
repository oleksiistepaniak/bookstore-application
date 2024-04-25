import {ClientSession} from "mongodb";
import {UserRecord} from "../db/interfaces";
import {AppDb} from "../db/AppDb";

export class UserRepository {

    async create(session: ClientSession, userRecord: UserRecord): Promise<void> {
        await AppDb.instance.usersCollection.insertOne(userRecord, {session});
    }
}