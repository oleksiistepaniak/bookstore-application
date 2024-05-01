import {FastifyInstance} from "fastify";
import {CreateUserDto} from "../src/dto/user/CreateUserDto";
import {app, main} from "../src";
import dotenv from "dotenv";
import {AppDb} from "../src/db/AppDb";
import {UserModel} from "../src/model/UserModel";
import {AuthenticationDto} from "../src/dto/user/AuthenticationDto";
import bcrypt from "bcryptjs";
import {AppConf} from "../src/config/AppConf";

let test_app: FastifyInstance;

export const validCreateUserDto: CreateUserDto = {
    email: "alex@gmail.com",
    password: "alexALEX228",
    age: 22,
    firstName: "Alex",
    lastName: "Stepaniak",
};

export const validAuthenticationDto: AuthenticationDto = {
    email: "alex@gmail.com",
    password: "alexALEX228",
};

export async function init(): Promise<FastifyInstance> {
    test_app = app;
    dotenv.config({ path: ".test.env" });
    await main();
    return test_app;
}

export async function clearUsers(): Promise<void> {
    await AppDb.instance.usersCollection.deleteMany({});
}

export async function setUser(userModel: UserModel): Promise<void> {
    const hashedPassword = await bcrypt.hash(userModel.password, AppConf.instance.SALT);
    await AppDb.instance.usersCollection.insertOne({
        ...userModel.data,
        password: hashedPassword,
    });
}

export async function dispose(): Promise<void> {
    try {
        await app.close();
        app.log.info('Server has been successfully disposed!');
    } catch (error) {
        app.log.error('An error occurred during disposing a server!');
        throw error;
    }
}
