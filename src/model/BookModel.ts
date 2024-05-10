import {BookRecord} from "../db/interfaces";
import {ObjectId} from "mongodb";
import {EBookCategory} from "../interfaces";
import {CreateBookDto} from "../dto/book/CreateBookDto";
import {BookReplyDto} from "../dto/book/BookReplyDto";

export class BookModel {
    private readonly _data: BookRecord;

    constructor(data: BookRecord) {
        this._data = {
            ...data,
        }
    }

    get data(): BookRecord {
        return this._data;
    }

    get id(): ObjectId {
        return this._data._id;
    }

    get title(): string {
        return this._data.title;
    }

    get description(): string {
        return this._data.description;
    }

    get numberOfPages(): number {
        return this._data.numberOfPages;
    }

    get category(): EBookCategory {
        return this._data.category;
    }

    get authorsIds(): ObjectId[] {
        return this._data.authorsIds;
    }

    static create(dto: CreateBookDto): BookModel {
        return new BookModel({
            _id: new ObjectId(),
            title: dto.title,
            description: dto.description,
            numberOfPages: dto.numberOfPages,
            category: dto.category as unknown as EBookCategory,
            authorsIds: dto.authorsIds.map(it => new ObjectId(it)),
        });
    }

    mapToDto(): BookReplyDto {
        return {
            id: this.id.toString(),
            title: this.title,
            description: this.description,
            numberOfPages: this.numberOfPages,
            category: this.category.toString(),
            authorsIds: this.authorsIds.map(it => it.toString()),
        };
    }
}
