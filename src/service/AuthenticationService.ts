import {ClientSession} from "mongodb";
import {CreateUserDto} from "../dto/user/CreateUserDto";
import {UserModel} from "../model/UserModel";
import bcrypt from "bcryptjs";
import {AppConf} from "../config/AppConf";
import {UserRepository} from "../repository/UserRepository";
import {ApiError} from "../error/ApiError";
import {ApiMessages} from "../util/ApiMessages";

export class AuthenticationService {
    private static _instance: AuthenticationService;

    private constructor() {
    }

    static get instance() {
        if (!this._instance) {
            this._instance = new AuthenticationService();
        }
        return this._instance;
    }

    async signup(session: ClientSession, userParams: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(userParams.password, AppConf.instance.SALT);
        userParams.password = hashedPassword;

        const userModel = UserModel.create(userParams);
        try {
            await UserRepository.instance.createUser(session, userModel);
            return userModel.mapToDto();
        } catch (error) {
            const errorMessage = error as ApiError;
            if (errorMessage.message.includes('E11000') || errorMessage.message.includes('duplicate key')) {
                throw new ApiError(ApiMessages.USER.USER_EXISTS);
            }
        }
    }
}