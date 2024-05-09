import {AuthorRecord} from "../db/interfaces";
import {ObjectId} from "mongodb";
import {CreateAuthorDto} from "../dto/author/CreateAuthorDto";
import {AuthorReplyDto} from "../dto/author/AuthorReplyDto";

export class AuthorModel {
    private readonly _data: AuthorRecord;

    constructor(data: AuthorRecord) {
        this._data = {
            ...data
        }
    }

    get data(): AuthorRecord {
        return this._data;
    }

    get id(): ObjectId {
        return this._data._id;
    }

    get name(): string {
        return this._data.name;
    }

    get surname(): string {
        return this._data.surname;
    }

    static create(dto: CreateAuthorDto): AuthorModel {
        return new AuthorModel({
            _id: new ObjectId(),
            name: dto.name,
            surname: dto.surname,
        });
    }

    mapToDto(): AuthorReplyDto {
        return {
            id: this.id.toString(),
            name: this.name,
            surname: this.surname,
        };
    }
}