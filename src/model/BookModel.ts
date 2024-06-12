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

    set title(title: string) {
        this._data.title = title;
    }

    set description(description: string) {
        this._data.description = description;
    }

    set numberOfPages(numberOfPages: number) {
        this._data.numberOfPages = numberOfPages;
    }

    set category(category: EBookCategory) {
        this._data.category = category;
    }

    set authorsIds(authorsIds: ObjectId[]) {
        this._data.authorsIds = authorsIds;
    }

    static create(dto: CreateBookDto): BookModel {
        return new BookModel({
            _id: new ObjectId(),
            title: dto.title,
            description: dto.description,
            numberOfPages: dto.numberOfPages,
            category: dto.category as unknown as EBookCategory,
            authorsIds: dto.authorsIds.map(it => new ObjectId(it)),
            userCreatorId: new ObjectId()
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
