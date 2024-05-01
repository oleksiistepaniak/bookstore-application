import {FastifyInstance} from "fastify";
import {CreateUserDto} from "../src/dto/user/CreateUserDto";
import {app} from "../src";
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
        test_app.server.close();
        test_app.log.info("Server has been successfully disposed!");
    } catch (error) {
        test_app.log.error("An error occurred during disposing a server!");
        throw error;
    }
}
