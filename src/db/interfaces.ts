import {ObjectId} from "mongodb";
import {EBookCategory, ENationality} from "../interfaces";

export interface UserRecord {
    _id: ObjectId;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    age: number;
}

export interface AuthorRecord {
    _id: ObjectId;
    name: string;
    surname: string;
    nationality: ENationality;
    biography: string;
}

export interface BookRecord {
    _id: ObjectId;
    title: string;
    description: string;
    numberOfPages: number;
    category: EBookCategory;
    authorsIds: ObjectId[];
}
