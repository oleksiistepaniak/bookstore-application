import {FastifyInstance} from "fastify";
import {CreateUserDto} from "../src/dto/user/CreateUserDto";
import {app} from "../src";
import {AppDb} from "../src/db/AppDb";
import {UserModel} from "../src/model/UserModel";
import {AuthenticationDto} from "../src/dto/user/AuthenticationDto";
import bcrypt from "bcryptjs";
import {AppConf} from "../src/config/AppConf";
import {TokenReplyDto} from "../src/dto/user/TokenReplyDto";
import {AuthenticationService} from "../src/service/AuthenticationService";
import {Constants} from "../src/constants";
import {CreateAuthorDto} from "../src/dto/author/CreateAuthorDto";
import {ENationality} from "../src/interfaces";
import {AuthorModel} from "../src/model/AuthorModel";

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

export const validCreateAuthorDto: CreateAuthorDto = {
    name: "Petro",
    surname: "Mostavchuk",
    nationality: ENationality.Ukrainian.toString(),
    biography: "Petro Mostavchuk is a Ukrainian author known for his captivating storytelling and profound insights" +
        " into the human condition. Born and raised in the picturesque Carpathian Mountains," +
        " Petro draws inspiration from the rich cultural heritage and natural beauty of his homeland." +
        " With a keen eye for detail and a deep understanding of the complexities of life, " +
        "Petro weaves tales that resonate with readers from all walks of life. His works explore themes of love," +
        " loss, resilience, and the eternal search for meaning. Through his writing, Petro seeks to illuminate" +
        " the beauty and depth of the Ukrainian spirit while inviting readers on a journey" +
        " of self-discovery and reflection."
};

export const validCreateAuthorDtoTwo: CreateAuthorDto = {
    name: "Taras",
    surname: "Shevchenko",
    nationality: ENationality.Ukrainian.toString(),
    biography: "Taras Shevchenko was a Ukrainian poet, writer, artist, and political figure. He is considered" +
        " the greatest Ukrainian poet and an iconic figure of Ukrainian culture. Shevchenko's literary works are" +
        " regarded as classics of Ukrainian literature and have had a profound impact on the development of Ukrainian" +
        " identity and national consciousness. Born into a serf family in 1814, Shevchenko overcame numerous hardships" +
        " to become one of the most influential figures in Ukrainian history. His poetry often explores themes of" +
        " freedom, justice, and the struggles of the Ukrainian people. Shevchenko's legacy continues to inspire " +
        "generations of Ukrainians and people around the world."
};

export async function init(): Promise<FastifyInstance> {
    test_app = app;
    return test_app;
}

export async function getValidToken(): Promise<TokenReplyDto> {
    const replyDto = await AuthenticationService.instance.signin(Constants.NO_SESSION, validAuthenticationDto);
    return replyDto;
}

export async function clearUsers(): Promise<void> {
    await AppDb.instance.usersCollection.deleteMany({});
}

export async function clearAuthors(): Promise<void> {
    await AppDb.instance.authorsCollection.deleteMany({});
}

export async function clearBooks(): Promise<void> {
    await AppDb.instance.booksCollection.deleteMany({});
}

export async function setUser(userModel: UserModel): Promise<void> {
    const hashedPassword = await bcrypt.hash(userModel.password, AppConf.instance.SALT);
    await AppDb.instance.usersCollection.insertOne({
        ...userModel.data,
        password: hashedPassword,
    });
}

export async function setAuthor(authorModel: AuthorModel) {
    await AppDb.instance.authorsCollection.insertOne({...authorModel.data});
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
