import {FastifyInstance} from "fastify";
import {ObjectId} from "mongodb";
import {CreateBookDto} from "../../../src/dto/book/CreateBookDto";
import {
    clearAuthors,
    clearBooks,
    clearUsers, dispose,
    getValidToken,
    init, setAuthor, setBook,
    setUser,
    validCreateAuthorDto, validCreateAuthorDtoTwo,
    validCreateUserDto
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
    let validToken: string;
    let validAuthorId: ObjectId;
    let validAuthorIdTwo: ObjectId;
    let validBookId: ObjectId;
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
            category: EBookCategory.NON.toString(),
            numberOfPages: 354,
            authorsIds: [validAuthorId.toString()],
        };
        const bookModel = BookModel.create(validCreateBookDto);
        await setBook(bookModel);
        validBookId = bookModel.id;
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
            .set("Authorization", `Bearer ${validToken}`)
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
            .set("Authorization", `Bearer ${validToken}`)
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
            .set("Authorization", `Bearer ${validToken}`)
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
            .set("Authorization", `Bearer ${validToken}`)
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
            .set("Authorization", `Bearer ${validToken}`)
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
            .set("Authorization", `Bearer ${validToken}`)
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
            .set("Authorization", `Bearer ${validToken}`)
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
            .set("Authorization", `Bearer ${validToken}`)
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
            .set("Authorization", `Bearer ${validToken}`)
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
            .set("Authorization", `Bearer ${validToken}`)
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
            .set("Authorization", `Bearer ${validToken}`)
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
            .set("Authorization", `Bearer ${validToken}`)
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
            .set("Authorization", `Bearer ${validToken}`)
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
            .set("Authorization", `Bearer ${validToken}`)
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
            .set("Authorization", `Bearer ${validToken}`)
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
            .set("Authorization", `Bearer ${validToken}`)
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
            .set("Authorization", `Bearer ${validToken}`)
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
            .set("Authorization", `Bearer ${validToken}`)
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
            .set("Authorization", `Bearer ${validToken}`)
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
            .set("Authorization", `Bearer ${validToken}`)
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
            .set("Authorization", `Bearer ${validToken}`)
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
            .set("Authorization", `Bearer ${validToken}`)
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
});
