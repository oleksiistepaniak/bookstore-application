import {FastifyInstance} from "fastify";
import {
    clearAuthors,
    clearBooks,
    clearUsers,
    dispose,
    getValidToken,
    init, setAuthor,
    setUser, validCreateAuthorDto, validCreateAuthorDtoTwo,
    validCreateUserDto
} from "../../TestHelper";
import {UserModel} from "../../../src/model/UserModel";
import {ObjectId} from "mongodb";
import {AuthorModel} from "../../../src/model/AuthorModel";
import request from "supertest";
import should from "should";
import {ApiMessages} from "../../../src/util/ApiMessages";
import {CreateBookDto} from "../../../src/dto/book/CreateBookDto";
import {EBookCategory} from "../../../src/interfaces";
import {Constants} from "../../../src/constants";

describe("create.book.test", () => {
    let app: FastifyInstance;
    let validToken: string;
    let validAuthorId: ObjectId;
    let validAuthorIdTwo: ObjectId;
    let validCreateBookDto: CreateBookDto;
    const nonExistsAuthorId = "663d343828ab341641086570";

    before(async () => {
        app = await init();
        await clearUsers();
        await clearBooks();
        await clearAuthors();
        const userModel = UserModel.create(validCreateUserDto);
        await setUser(userModel);
        const tokenReplyDto = await getValidToken();
        validToken = tokenReplyDto.token;
        const firstAuthor = AuthorModel.create(validCreateAuthorDto);
        const secondAuthor = AuthorModel.create(validCreateAuthorDtoTwo);
        await setAuthor(firstAuthor);
        await setAuthor(secondAuthor);
        validAuthorId = firstAuthor.id;
        validAuthorIdTwo = secondAuthor.id;
        validCreateBookDto = {
            title: "How to quickly learn C++? Full guide and instructions!",
            description: "This book guides you how to learn C++ more efficiently and dive into more complex" +
                " algorithms and data structures! So, let's do it together!",
            category: EBookCategory.Non.toString(),
            numberOfPages: 354,
            authorsIds: [validAuthorId.toString(), validAuthorIdTwo.toString()],
        };
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
            .post("/api/book/create")
            .expect(401);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTH_MIDDLEWARE.TOKEN_NOT_PROVIDED,
        });
        should(reply.status).deepEqual(401);
    });

    it("invalid token (auth)", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/create")
            .set("Authorization", "invalid_token")
            .expect(401);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTH_MIDDLEWARE.INVALID_TOKEN,
        });
        should(reply.status).deepEqual(401);
    });

    it("title not string", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateBookDto,
                title: null,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.TITLE_NOT_STRING,
        });
        should(reply.status).deepEqual(400);
    });

    it("empty title", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateBookDto,
                title: "",
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.INVALID_TITLE_LENGTH,
        });
        should(reply.status).deepEqual(400);
    });

    it("title length less than min required symbols", async () => {
        const server = app.server;
        const title = "a".repeat(Constants.BOOK.MIN_TITLE_LENGTH - 1);

        const reply = await request(server)
            .post("/api/book/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateBookDto,
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
            .post("/api/book/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateBookDto,
                title,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.INVALID_TITLE_LENGTH,
        });
        should(reply.status).deepEqual(400);
    });

    it("title not latin chars", async () => {
        const server = app.server;
        const title = "Ж".repeat(Constants.BOOK.MIN_TITLE_LENGTH);

        const reply = await request(server)
            .post("/api/book/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateBookDto,
                title,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.ONLY_LATIN_CHARS_FOR_TITLE,
        });
        should(reply.status).deepEqual(400);
    });

    it("description not string", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateBookDto,
                description: null,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.DESCRIPTION_NOT_STRING,
        });
        should(reply.status).deepEqual(400);
    });

    it("description empty", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateBookDto,
                description: "",
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.INVALID_DESCRIPTION_LENGTH,
        });
        should(reply.status).deepEqual(400);
    });

    it("description length less than min required symbols", async () => {
        const server = app.server;
        const description = "a".repeat(Constants.BOOK.MIN_DESCRIPTION_LENGTH - 1);

        const reply = await request(server)
            .post("/api/book/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateBookDto,
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
            .post("/api/book/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateBookDto,
                description,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.INVALID_DESCRIPTION_LENGTH,
        });
        should(reply.status).deepEqual(400);
    });

    it("description not latin chars", async () => {
        const server = app.server;
        const description = "Ж".repeat(Constants.BOOK.MIN_DESCRIPTION_LENGTH);

        const reply = await request(server)
            .post("/api/book/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateBookDto,
                description,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.ONLY_LATIN_CHARS_FOR_DESCRIPTION,
        });
        should(reply.status).deepEqual(400);
    });

    it("category not string", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateBookDto,
                category: null,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.CATEGORY_NOT_STRING,
        });
        should(reply.status).deepEqual(400);
    });

    it("empty category", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateBookDto,
                category: "",
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.INVALID_CATEGORY,
        });
        should(reply.status).deepEqual(400);
    });

    it("invalid category", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateBookDto,
                category: "invalid_category",
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.INVALID_CATEGORY,
        });
        should(reply.status).deepEqual(400);
    });

    it("number of pages not number", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateBookDto,
                numberOfPages: null,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.NUMBER_OF_PAGES_NOT_NUMBER,
        });
        should(reply.status).deepEqual(400);
    });

    it("number of pages less than min required", async () => {
        const server = app.server;
        const numberOfPages = Constants.BOOK.MIN_NUMBER_OF_PAGES - 1;

        const reply = await request(server)
            .post("/api/book/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateBookDto,
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
            .post("/api/book/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateBookDto,
                numberOfPages,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.INVALID_NUMBER_OF_PAGES,
        });
        should(reply.status).deepEqual(400);
    });

    it("authors id not string array", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateBookDto,
                authorsIds: null,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.INVALID_AUTHORS_IDS_ARRAY,
        });
        should(reply.status).deepEqual(400);
    });

    it("one of authors ids empty", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateBookDto,
                authorsIds: [""],
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.INVALID_AUTHOR_ID,
        });
        should(reply.status).deepEqual(400);
    });

    it("author not found", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateBookDto,
                authorsIds: [nonExistsAuthorId],
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.AUTHOR_NOT_FOUND,
        });
        should(reply.status).deepEqual(400);
    });

    it("success", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateBookDto,
            })
            .expect(200);

        should(reply.body).deepEqual({
            ...validCreateBookDto,
            id: reply.body.id,
        });
        should(reply.status).deepEqual(200);
    });
});
