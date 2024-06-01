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
import {BookModel} from "../../../src/model/BookModel";
import request from "supertest";
import should from "should";
import {ApiMessages} from "../../../src/util/ApiMessages";

describe("remove.book.test", () => {
    let app: FastifyInstance;
    let validToken: string;
    let validBookId: ObjectId;
    let validCreateBookDto: CreateBookDto;
    const nonExistsBookId = "663d343828ab341641086570";

    before(async () => {
        app = await init();
        await clearUsers();
        await clearBooks();
        await clearAuthors();
        const userModel = UserModel.create(validCreateUserDto);
        await setUser(userModel);
        const tokenReplyDto = await getValidToken();
        validToken = tokenReplyDto.token;
    });

    beforeEach(async () => {
        const firstAuthor = AuthorModel.create(validCreateAuthorDto);
        const secondAuthor = AuthorModel.create(validCreateAuthorDtoTwo);
        await setAuthor(firstAuthor);
        await setAuthor(secondAuthor);
        validCreateBookDto = {
            title: "How to quickly learn C++? Full guide and instructions!",
            description: "This book guides you how to learn C++ more efficiently and dive into more complex" +
                " algorithms and data structures! So, let's do it together!",
            category: EBookCategory.NON.toString(),
            numberOfPages: 354,
            authorsIds: [firstAuthor.id.toString(), secondAuthor.id.toString()],
        };
        const bookModel = BookModel.create(validCreateBookDto);
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
            .post("/api/book/remove")
            .expect(401);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTH_MIDDLEWARE.TOKEN_NOT_PROVIDED,
        });
        should(reply.status).deepEqual(401);
    });

    it("invalid token (auth)", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/remove")
            .set("Authorization", "Bearer invalid_token")
            .expect(401);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTH_MIDDLEWARE.INVALID_TOKEN,
        });
        should(reply.status).deepEqual(401);
    });

    it("invalid book id", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/remove")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: "invalid_book_id",
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.INVALID_BOOK_ID,
        });
        should(reply.status).deepEqual(400);
    });

    it("book not found", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/remove")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: nonExistsBookId,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.BOOK_NOT_FOUND,
        });
        should(reply.status).deepEqual(400);
    });

    it("success", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/remove")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: validBookId.toString(),
            })
            .expect(200);

        should(reply.body).deepEqual({
            ...validCreateBookDto,
            id: validBookId.toString(),
        });
        should(reply.status).deepEqual(200);
    });
});
