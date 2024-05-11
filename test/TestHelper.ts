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
import {BookModel} from "../src/model/BookModel";

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
    nationality: ENationality.UKRAINIAN.toString(),
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
    nationality: ENationality.UKRAINIAN.toString(),
    biography: "Taras Shevchenko was a Ukrainian poet, writer, artist, and political figure. He is considered" +
        " the greatest Ukrainian poet and an iconic figure of Ukrainian culture. Shevchenko's literary works are" +
        " regarded as classics of Ukrainian literature and have had a profound impact on the development of Ukrainian" +
        " identity and national consciousness. Born into a serf family in 1814, Shevchenko overcame numerous hardships" +
        " to become one of the most influential figures in Ukrainian history. His poetry often explores themes of" +
        " freedom, justice, and the struggles of the Ukrainian people. Shevchenko's legacy continues to inspire " +
        "generations of Ukrainians and people around the world."
};

export const validCreateAuthorDtoThree: CreateAuthorDto = {
    name: "Jean",
    surname: "Dupont",
    nationality: ENationality.FRENCH.toString(),
    biography: "Jean Dupont is a renowned French writer, famous for his captivating novels and profound insights" +
        " into the human condition. Born and raised in the beautiful city of Paris, Dupont draws inspiration from " +
        "the richness of French culture and the charm of urban life. With a keen eye for detail and a deep" +
        " understanding of life's complexities, Dupont weaves stories that resonate with readers from all walks of" +
        " life. His works explore themes of love, loss, resilience, and the eternal quest for meaning. Through his" +
        " writing, Dupont seeks to illuminate the beauty and depth of the French spirit while inviting readers on" +
        " a journey of self-discovery and reflection."
};

export const validCreateAuthorDtoFour: CreateAuthorDto = {
    name: "Fritz",
    surname: "Schneider",
    nationality: ENationality.GERMAN.toString(),
    biography: "Fritz Schneider is a renowned German writer, known for his captivating novels and profound insights" +
        " into the human condition. Born and raised in the historic city of Berlin, Schneider draws inspiration from" +
        " the richness of German culture and the vibrant urban life. With a sharp eye for detail and a deep" +
        " understanding of life's complexity, Schneider weaves stories that resonate with readers from all walks" +
        " of life. His works explore themes of love, loss, resilience, and the eternal quest for meaning. Through" +
        " his writing, Schneider seeks to illuminate the beauty and depth of the German spirit while inviting " +
        "readers on a journey of self-discovery and reflection."
};

export const validCreateAuthorDtoFive: CreateAuthorDto = {
    name: "Jonas",
    surname: "Petrauskas",
    nationality: ENationality.LITHUANIAN.toString(),
    biography: "Jonas Petrauskas is a renowned Lithuanian writer, known for his captivating storytelling and profound" +
        " insights into the human condition. Born and raised in the picturesque landscapes of Lithuania, Petrauskas" +
        " draws inspiration from the rich cultural heritage and natural beauty of his homeland. With a keen eye for " +
        "detail and a deep understanding of life's complexities, Petrauskas weaves tales that resonate with readers" +
        " from all walks of life. His works explore themes of love, loss, resilience, and the eternal quest for" +
        " meaning. Through his writing, Petrauskas seeks to illuminate the beauty and depth of the Lithuanian spirit" +
        " while inviting readers on a journey of self-discovery and reflection."
};

export const validCreateAuthorDtoSix: CreateAuthorDto = {
    name: "Martins",
    surname: "Kalnins",
    nationality: ENationality.LATVIAN.toString(),
    biography: "Martins Kalnins is a prominent Latvian author, celebrated for his captivating novels and insightful" +
        " observations on life. Born and raised amidst the picturesque landscapes of Latvia, Kalnins draws inspiration" +
        " from the rich cultural heritage and natural beauty of his homeland. With a keen eye for detail and a deep" +
        " understanding of human nature, Kalnins crafts stories that resonate with readers of all backgrounds. His " +
        "works explore themes of love, loss, resilience, and the eternal quest for meaning. Through his writing, " +
        "Kalnins aims to illuminate the beauty and complexity of Latvian culture while inviting readers on a journey" +
        " of self-discovery and reflection."
};

export const validCreateAuthorDtoSeven: CreateAuthorDto = {
    name: "Giuseppe",
    surname: "Ricci",
    nationality: ENationality.ITALIAN.toString(),
    biography: "Giuseppe Ricci is a renowned Italian author, known for his captivating storytelling and profound " +
        "insights into the human psyche. Born and raised in the historic city of Rome, Ricci draws inspiration from" +
        " the richness of Italian culture and the vibrant tapestry of urban life. With a deep understanding of human" +
        " emotions and motivations, Ricci weaves tales that resonate with readers on a profound level. His works " +
        "explore themes of love, passion, betrayal, and the complexities of human relationships. Through his" +
        " writing, Ricci seeks to capture the essence of Italian life and culture while inviting readers on a " +
        "journey of self-discovery and introspection."
};

export const validCreateAuthorDtoEight: CreateAuthorDto = {
    name: "Maria",
    surname: "Garcia",
    nationality: ENationality.SPANISH.toString(),
    biography: "Maria Garcia is a celebrated Spanish author, known for her evocative prose and keen insights into" +
        " the human experience. Born and raised in the vibrant city of Madrid, Garcia draws inspiration from the" +
        " rich tapestry of Spanish culture and the beauty of the Mediterranean landscape. With a lyrical writing" +
        " style and a deep empathy for her characters, Garcia creates stories that resonate with readers on a " +
        "deeply emotional level. Her works explore themes of love, identity, and the search for meaning in a" +
        " complex world. Through her writing, Garcia seeks to celebrate the richness and diversity of Spanish" +
        " culture while inviting readers to reflect on their own lives and experiences."
};

export const validCreateAuthorDtoNine: CreateAuthorDto = {
    name: "Jan",
    surname: "De Vries",
    nationality: ENationality.DUTCH.toString(),
    biography: "Jan De Vries is a prominent Dutch author, celebrated for his insightful storytelling and keen " +
        "observations on life. Born and raised in the picturesque countryside of the Netherlands, De Vries draws" +
        " inspiration from the rich cultural heritage and natural beauty of his homeland. With a keen eye for " +
        "detail and a deep understanding of human nature, De Vries crafts stories that resonate with readers from" +
        " all walks of life. His works explore themes of love, loss, resilience, and the enduring human spirit." +
        " Through his writing, De Vries seeks to illuminate the beauty and complexity of Dutch culture while" +
        " inviting readers on a journey of self-discovery and introspection."
};

export const validCreateAuthorDtoTen: CreateAuthorDto = {
    name: "Anna",
    surname: "Kowalska",
    nationality: ENationality.POLISH.toString(),
    biography: "Anna Kowalska is a celebrated Polish author, known for her compelling narratives and profound" +
        " insights into the human condition. Born and raised in the historic city of Krakow, Kowalska draws" +
        " inspiration from the rich tapestry of Polish history and culture. With a keen eye for detail and" +
        " a deep empathy for her characters, Kowalska creates stories that resonate with readers on a profound" +
        " emotional level. Her works explore themes of love, identity, and the search for meaning in a rapidly" +
        " changing world. Through her writing, Kowalska seeks to celebrate the resilience and strength of the" +
        " Polish people while inviting readers to reflect on their own lives and experiences."
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

export async function setAuthor(authorModel: AuthorModel): Promise<void> {
    await AppDb.instance.authorsCollection.insertOne({...authorModel.data});
}

export async function setBook(bookModel: BookModel): Promise<void> {
    await AppDb.instance.booksCollection.insertOne({...bookModel.data});
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
