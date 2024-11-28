import {ClientSession} from "mongodb";
import {CreateUserDto} from "../dto/user/CreateUserDto";
import {UserModel} from "../model/UserModel";
import bcrypt from "bcryptjs";
import {AppConf} from "../config/AppConf";
import {UserRepository} from "../repository/UserRepository";
import {ApiError} from "../error/ApiError";
import {ApiMessages} from "../util/ApiMessages";
import {Constants} from "../constants";
import {AuthenticationDto} from "../dto/user/AuthenticationDto";
import jwt from "jsonwebtoken";
import {TokenReplyDto} from "../dto/user/TokenReplyDto";
import {UserReplyDto} from "../dto/user/UserReplyDto";
import {check} from "../util/ApiCheck";

export class AuthenticationService {
    private static _instance: AuthenticationService;

    private constructor() {
    }

    // TODO: all singletons as a replacer of DI should be altered using other solution
    public static get instance() {
        if (!this._instance) {
            this._instance = new AuthenticationService();
        }
        return this._instance;
    }

    async signup(session: ClientSession, userParams: CreateUserDto): Promise<UserReplyDto> {
        const conf = AppConf.instance;
        const userRepo = UserRepository.instance;

        const hashedPassword = await bcrypt.hash(userParams.password, conf.SALT);
        userParams.password = hashedPassword;

        const userModel = UserModel.create(userParams);
        try {
            await userRepo.createUser(session, userModel);
        } catch (error) {
            const errorMessage = error as ApiError;
            if (errorMessage.message.includes(Constants.USER.E11000_MESSAGE) ||
                errorMessage.message.includes(Constants.USER.DUPLICATE_KEY_MESSAGE)) {
                throw new ApiError(ApiMessages.USER.USER_EXISTS);
            } else {
                throw new ApiError(ApiMessages.USER.CANNOT_CREATE_USER);
            }
        }
        return userModel.mapToDto();
    }

    async signin(session: ClientSession, userParams: AuthenticationDto): Promise<TokenReplyDto> {
        const conf = AppConf.instance;
        const userRepo = UserRepository.instance;

        const user = await userRepo.findUserByEmail(session, userParams.email);
        check(user, ApiMessages.USER.INVALID_PASSWORD_OR_EMAIL);

        const isPasswordValid = await bcrypt.compare(userParams.password, user.password);
        check(isPasswordValid, ApiMessages.USER.INVALID_PASSWORD_OR_EMAIL);

        const token = jwt.sign({user: user.id.toString()}, conf.JWT_SECRET, {expiresIn: conf.JWT_EXPIRE});
        return { token };
    }
}
