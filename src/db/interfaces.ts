import {ObjectId} from "mongodb";

export interface UserRecord {
    _id: ObjectId;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    age: number;
}
