import {FastifyInstance} from "fastify";
import {ObjectId} from "mongodb";
import {CreateBookDto} from "../../../src/dto/book/CreateBookDto";
import {
    clearAuthors,
    clearBooks,
    clearUsers, dispose,
    getValidToken,
    init, setAuthor, setBook,
    setUser, validAuthenticationDto, validAuthenticationDtoTwo,
    validCreateAuthorDto, validCreateAuthorDtoTwo,
    validCreateUserDto, validCreateUserDtoTwo
} from "../../TestHelper";
import {UserModel} from "../../../src/model/UserModel";
import {AuthorModel} from "../../../src/model/AuthorModel";
import {EBookCategory} from "../../../src/interfaces";
import request from "supertest";
import should from "should";
import {ApiMessages} from "../../../src/util/ApiMessages";
import {BookModel} from "../../../src/model/BookModel";
import {Constants} from "../../../src/constants";

describe("replace.book.test", () => {
    let app: FastifyInstance;
    let firstValidToken: string;
    let secondValidToken: string;
    let validAuthorId: ObjectId;
    let validAuthorIdTwo: ObjectId;
    let validBookId: ObjectId;
    let validUserId: string;
    let validCreateBookDto: CreateBookDto;
    const nonExistsAuthorId = "663d343828ab341641086570";

    before(async () => {
        app = await init();
        await clearUsers();
        await clearBooks();
        await clearAuthors();
        const firstUser = UserModel.create(validCreateUserDto);
        await setUser(firstUser);
        const secondUser = UserModel.create(validCreateUserDtoTwo);
        await setUser(secondUser);
        validUserId = firstUser.id.toString();
        const firstTokenReply = await getValidToken(validAuthenticationDto);
        firstValidToken = firstTokenReply.token;
        const secondTokenReply = await getValidToken(validAuthenticationDtoTwo);
        secondValidToken = secondTokenReply.token;
    });

    beforeEach(async () => {
        const firstAuthor = AuthorModel.create(validCreateAuthorDto, validUserId);
        const secondAuthor = AuthorModel.create(validCreateAuthorDtoTwo, validUserId);
        await setAuthor(firstAuthor);
        await setAuthor(secondAuthor);
        validAuthorId = firstAuthor.id;
        validAuthorIdTwo = secondAuthor.id;
        validCreateBookDto = {
            title: "How to quickly learn C++? Full guide and instructions!",
            description: "This book guides you how to learn C++ more efficiently and dive into more complex" +
                " algorithms and data structures! So, let's do it together!",
            category: EBookCategory.NON.toString(),
            numberOfPages: 354,
            authorsIds: [validAuthorId.toString()],
        };
        const bookModel = BookModel.create(validCreateBookDto, validUserId);
        await setBook(bookModel);
        validBookId = bookModel.id;
    });

    afterEach(async () => {
        await clearAuthors();
        await clearBooks();
    });

    after(async () => {
        await clearAuthors();
        await clearBooks();
        await clearUsers();
        await dispose();
    });

    it("token not provided (auth)", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/replace")
            .expect(401);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTH_MIDDLEWARE.TOKEN_NOT_PROVIDED,
        });
        should(reply.status).deepEqual(401);
    });

    it("invalid token (auth)", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", "Bearer invalid_token")
            .expect(401);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTH_MIDDLEWARE.INVALID_TOKEN,
        });
        should(reply.status).deepEqual(401);
    });

    it("invalid replacing", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: validBookId.toString()
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.INVALID_BOOK_REPLACING,
        });
        should(reply.status).deepEqual(400);
    });

    it("title not string", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: validBookId.toString(),
                title: true,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.TITLE_NOT_STRING,
        });
        should(reply.status).deepEqual(400);
    });

    it("description not string", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: validBookId.toString(),
                description: true,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.DESCRIPTION_NOT_STRING,
        });
        should(reply.status).deepEqual(400);
    });

    it("category not string", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: validBookId.toString(),
                category: true,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.CATEGORY_NOT_STRING,
        });
        should(reply.status).deepEqual(400);
    });

    it("author id not string", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: validBookId.toString(),
                authorsIds: [null],
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.AUTHOR_ID_NOT_STRING,
        });
        should(reply.status).deepEqual(400);
    });

    it("number of pages not number", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: validBookId.toString(),
                numberOfPages: true,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.NUMBER_OF_PAGES_NOT_NUMBER,
        });
        should(reply.status).deepEqual(400);
    });

    it("invalid book id", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: "invalid_book_id",
                title: "a".repeat(Constants.BOOK.MIN_TITLE_LENGTH),
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.INVALID_BOOK_ID,
        });
        should(reply.status).deepEqual(400);
    });

    it("empty title", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: validBookId,
                title: "",
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.INVALID_BOOK_REPLACING,
        });
        should(reply.status).deepEqual(400);
    });

    it("empty description", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: validBookId,
                description: "",
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.INVALID_BOOK_REPLACING,
        });
        should(reply.status).deepEqual(400);
    });

    it("empty category", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: validBookId,
                category: "",
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.INVALID_BOOK_REPLACING,
        });
        should(reply.status).deepEqual(400);
    });

    it("title length less than min required symbols", async () => {
        const server = app.server;
        const title = "a".repeat(Constants.BOOK.MIN_TITLE_LENGTH - 1);

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: validBookId,
                title,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.INVALID_TITLE_LENGTH,
        });
        should(reply.status).deepEqual(400);
    });

    it("title length more than max required symbols", async () => {
        const server = app.server;
        const title = "a".repeat(Constants.BOOK.MAX_TITLE_LENGTH + 1);

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: validBookId,
                title,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.INVALID_TITLE_LENGTH,
        });
        should(reply.status).deepEqual(400);
    });

    it("title not only latin chars", async () => {
        const server = app.server;
        const title = "Ж".repeat(Constants.BOOK.MIN_TITLE_LENGTH);

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: validBookId,
                title,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.ONLY_LATIN_CHARS_FOR_TITLE,
        });
        should(reply.status).deepEqual(400);
    });

    it("description length less than min required symbols", async () => {
        const server = app.server;
        const description = "a".repeat(Constants.BOOK.MIN_DESCRIPTION_LENGTH - 1);

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: validBookId,
                description,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.INVALID_DESCRIPTION_LENGTH,
        });
        should(reply.status).deepEqual(400);
    });

    it("description length more than max required symbols", async () => {
        const server = app.server;
        const description = "a".repeat(Constants.BOOK.MAX_DESCRIPTION_LENGTH + 1);

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: validBookId,
                description,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.INVALID_DESCRIPTION_LENGTH,
        });
        should(reply.status).deepEqual(400);
    });

    it("description not only latin chars", async () => {
        const server = app.server;
        const description = "Ж".repeat(Constants.BOOK.MIN_DESCRIPTION_LENGTH);

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: validBookId,
                description,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.ONLY_LATIN_CHARS_FOR_DESCRIPTION,
        });
        should(reply.status).deepEqual(400);
    });

    it("invalid category", async () => {
        const server = app.server;
        const category = "invalid_category";

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: validBookId,
                category,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.INVALID_CATEGORY,
        });
        should(reply.status).deepEqual(400);
    });

    it("number of pages less than min required", async () => {
        const server = app.server;
        const numberOfPages = Constants.BOOK.MIN_NUMBER_OF_PAGES - 1;

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: validBookId,
                numberOfPages,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.INVALID_NUMBER_OF_PAGES,
        });
        should(reply.status).deepEqual(400);
    });

    it("number of pages more than max required", async () => {
        const server = app.server;
        const numberOfPages = Constants.BOOK.MAX_NUMBER_OF_PAGES + 1;

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: validBookId,
                numberOfPages,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.INVALID_NUMBER_OF_PAGES,
        });
        should(reply.status).deepEqual(400);
    });

    it("invalid author id", async () => {
        const server = app.server;
        const authorsIds = ["invalid_author_id"];

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: validBookId,
                authorsIds,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.INVALID_AUTHOR_ID,
        });
        should(reply.status).deepEqual(400);
    });

    it("book not found", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: nonExistsAuthorId,
                title: "a".repeat(Constants.BOOK.MIN_TITLE_LENGTH),
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.BOOK_NOT_FOUND,
        });
        should(reply.status).deepEqual(400);
    });

    it("author not found", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: validBookId,
                authorsIds: [nonExistsAuthorId],
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.AUTHOR_NOT_FOUND,
        });
        should(reply.status).deepEqual(400);
    });

    it("invalid user", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${secondValidToken}`)
            .send({
                id: validBookId,
                authorsIds: [validAuthorId],
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.INVALID_USER,
        });
        should(reply.status).deepEqual(400);
    });

    it("success with title", async () => {
        const server = app.server;
        const title = "a".repeat(Constants.BOOK.MIN_TITLE_LENGTH);

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: validBookId,
                title,
            })
            .expect(200);

        should(reply.body).deepEqual({
            ...validCreateBookDto,
            id: reply.body.id,
            title,
            userCreatorId: validUserId,
        });
        should(reply.status).deepEqual(200);
    });

    it("success with description", async () => {
        const server = app.server;
        const description = "a".repeat(Constants.BOOK.MIN_DESCRIPTION_LENGTH);

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: validBookId,
                description,
            })
            .expect(200);

        should(reply.body).deepEqual({
            ...validCreateBookDto,
            id: reply.body.id,
            description,
            userCreatorId: validUserId,
        });
        should(reply.status).deepEqual(200);
    });

    it("success with category", async () => {
        const server = app.server;
        const category = EBookCategory.BUSINESS.toString();

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: validBookId,
                category,
            })
            .expect(200);

        should(reply.body).deepEqual({
            ...validCreateBookDto,
            id: reply.body.id,
            category,
            userCreatorId: validUserId,
        });
        should(reply.status).deepEqual(200);
    });

    it("success with number of pages", async () => {
        const server = app.server;
        const numberOfPages = Constants.BOOK.MIN_NUMBER_OF_PAGES;

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: validBookId,
                numberOfPages,
            })
            .expect(200);

        should(reply.body).deepEqual({
            ...validCreateBookDto,
            id: reply.body.id,
            numberOfPages,
            userCreatorId: validUserId,
        });
        should(reply.status).deepEqual(200);
    });

    it("success with authorsIds", async () => {
        const server = app.server;
        const authorsIds = [validAuthorId.toString(), validAuthorIdTwo.toString()];

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: validBookId,
                authorsIds,
            })
            .expect(200);

        should(reply.body).deepEqual({
            ...validCreateBookDto,
            id: reply.body.id,
            authorsIds,
            userCreatorId: validUserId,
        });
        should(reply.status).deepEqual(200);
    });

    it("success with title and description", async () => {
        const server = app.server;
        const title = "a".repeat(Constants.BOOK.MIN_TITLE_LENGTH);
        const description = "a".repeat(Constants.BOOK.MIN_DESCRIPTION_LENGTH);

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: validBookId,
                title,
                description,
            })
            .expect(200);

        should(reply.body).deepEqual({
            ...validCreateBookDto,
            id: reply.body.id,
            title,
            description,
            userCreatorId: validUserId,
        });
        should(reply.status).deepEqual(200);
    });

    it("success with title, description and authorsIds", async () => {
        const server = app.server;
        const title = "a".repeat(Constants.BOOK.MIN_TITLE_LENGTH);
        const description = "a".repeat(Constants.BOOK.MIN_DESCRIPTION_LENGTH);
        const authorsIds = [validAuthorId.toString(), validAuthorIdTwo.toString()];

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: validBookId,
                title,
                description,
                authorsIds,
            })
            .expect(200);

        should(reply.body).deepEqual({
            ...validCreateBookDto,
            id: reply.body.id,
            title,
            description,
            authorsIds,
            userCreatorId: validUserId,
        });
        should(reply.status).deepEqual(200);
    });

    it("success with category and numberOfPages", async () => {
        const server = app.server;
        const category = EBookCategory.MYSTERY.toString();
        const numberOfPages = Constants.BOOK.MIN_NUMBER_OF_PAGES;

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: validBookId,
                category,
                numberOfPages,
            })
            .expect(200);

        should(reply.body).deepEqual({
            ...validCreateBookDto,
            id: reply.body.id,
            category,
            numberOfPages,
            userCreatorId: validUserId,
        });
        should(reply.status).deepEqual(200);
    });

    it("success with description, category, numberOfPages and authorsIds", async () => {
        const server = app.server;
        const category = EBookCategory.MYSTERY.toString();
        const numberOfPages = Constants.BOOK.MIN_NUMBER_OF_PAGES;
        const description = "a".repeat(Constants.BOOK.MIN_DESCRIPTION_LENGTH);
        const authorsIds = [validAuthorId.toString(), validAuthorIdTwo.toString()];

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: validBookId,
                category,
                numberOfPages,
                description,
                authorsIds,
            })
            .expect(200);

        should(reply.body).deepEqual({
            ...validCreateBookDto,
            id: reply.body.id,
            category,
            numberOfPages,
            description,
            authorsIds,
            userCreatorId: validUserId,
        });
        should(reply.status).deepEqual(200);
    });

    it("success with all params", async () => {
        const server = app.server;
        const category = EBookCategory.MYSTERY.toString();
        const numberOfPages = Constants.BOOK.MIN_NUMBER_OF_PAGES;
        const title = "a".repeat(Constants.BOOK.MIN_TITLE_LENGTH);
        const description = "a".repeat(Constants.BOOK.MIN_DESCRIPTION_LENGTH);
        const authorsIds = [validAuthorId.toString(), validAuthorIdTwo.toString()];

        const reply = await request(server)
            .post("/api/book/replace")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: validBookId,
                category,
                numberOfPages,
                description,
                authorsIds,
                title,
            })
            .expect(200);

        should(reply.body).deepEqual({
            ...validCreateBookDto,
            id: reply.body.id,
            category,
            numberOfPages,
            description,
            authorsIds,
            title,
            userCreatorId: validUserId,
        });
        should(reply.status).deepEqual(200);
    });
});
