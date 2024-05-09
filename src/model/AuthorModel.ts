import {AuthorRecord} from "../db/interfaces";
import {ObjectId} from "mongodb";
import {CreateAuthorDto} from "../dto/author/CreateAuthorDto";
import {AuthorReplyDto} from "../dto/author/AuthorReplyDto";
import {ENationality} from "../interfaces";

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

    get nationality(): ENationality {
        return this._data.nationality;
    }

    get biography(): string {
        return this._data.biography;
    }

    static create(dto: CreateAuthorDto): AuthorModel {
        return new AuthorModel({
            _id: new ObjectId(),
            name: dto.name,
            surname: dto.surname,
            nationality: dto.nationality as unknown as ENationality,
            biography: dto.biography,
        });
    }

    mapToDto(): AuthorReplyDto {
        return {
            id: this.id.toString(),
            name: this.name,
            surname: this.surname,
            nationality: this.nationality.toString(),
            biography: this.biography,
        };
    }
}