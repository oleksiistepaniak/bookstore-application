import {FastifyReply, FastifyRequest} from "fastify";
import {CreateUserDto} from "../dto/user/CreateUserDto";
import {check, isNumber, isString} from "../util/ApiCheck";
import {ApiMessages} from "../util/ApiMessages";
import {Constants} from "../constants";
import {AuthenticationService} from "../service/AuthenticationService";
import {AppDb} from "../db/AppDb";
import {UserReplyDto} from "../dto/user/UserReplyDto";
import {ApiError} from "../error/ApiError";

export class AuthenticationController {
    private static _instance: AuthenticationController;

    private constructor() {
    }

    public static get instance() {
        if (!this._instance) {
            this._instance = new AuthenticationController();
        }
        return this._instance;
    }

    async signup(request: FastifyRequest<{ Body: CreateUserDto }>, reply: FastifyReply) {
        try {
            const {email, password, firstName, lastName, age} = request.body;

            isString(email, ApiMessages.USER.EMAIL_NOT_STRING);
            isString(password, ApiMessages.USER.PASSWORD_NOT_STRING);
            isString(firstName, ApiMessages.USER.FIRSTNAME_NOT_STRING);
            isString(lastName, ApiMessages.USER.LASTNAME_NOT_STRING);
            isNumber(age, ApiMessages.USER.AGE_NOT_NUMBER);
            check(Constants.EMAIL_REGEXP.test(email), ApiMessages.USER.INVALID_EMAIL);
            check(Constants.PASSWORD_REGEXP.test(password), ApiMessages.USER.INVALID_PASSWORD);
            check(firstName.length >= Constants.USER.MIN_NAME_LENGTH &&
                firstName.length <= Constants.USER.MAX_NAME_LENGTH, ApiMessages.USER.INVALID_FIRSTNAME);
            check(lastName.length >= Constants.USER.MIN_NAME_LENGTH &&
                lastName.length <= Constants.USER.MAX_NAME_LENGTH, ApiMessages.USER.INVALID_LASTNAME);
            check(age >= Constants.USER.MIN_AGE_VALUE &&
                age <= Constants.USER.MAX_AGE_VALUE, ApiMessages.USER.INVALID_AGE);

            let dto: UserReplyDto;
            dto = await AppDb.instance.withTransaction((session) => {
                return AuthenticationService.instance.signup(session, request.body);
            });

            reply.status(200).send(dto);
        } catch (error) {
            const apiError = error as ApiError;
            reply.status(400).send({
                message: apiError.message,
            });
        }
    }
}