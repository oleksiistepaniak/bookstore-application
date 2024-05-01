import {UserRecord} from "../db/interfaces";
import {ObjectId} from "mongodb";
import {CreateUserDto} from "../dto/user/CreateUserDto";
import {UserReplyDto} from "../dto/user/UserReplyDto";

export class UserModel {
    private readonly _data: UserRecord;

    constructor(data: UserRecord) {
        this._data = {
            ...data
        }
    }

    get data(): UserRecord {
        return this._data;
    }

    get id(): ObjectId {
        return this._data._id;
    }

    get email(): string {
        return this._data.email;
    }

    get password(): string {
        return this._data.password;
    }

    get firstName(): string {
        return this._data.firstName;
    }

    get lastName(): string {
        return this._data.lastName;
    }

    get age(): number {
        return this._data.age;
    }

    static create(dto: CreateUserDto): UserModel {
        return new UserModel({
            _id: new ObjectId(),
            email: dto.email,
            password: dto.password,
            firstName: dto.firstName,
            lastName: dto.lastName,
            age: dto.age,
        });
    }

    mapToDto(): UserReplyDto {
        return {
            id: this.id.toString(),
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            age: this.age,
        };
    }
}
