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

describe("find.books.by.category.test", () => {
    let app: FastifyInstance;
    let validToken: string;
    let validAuthorId: ObjectId;
    let validAuthorIdTwo: ObjectId;
    let validCreateBookDto: CreateBookDto;

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
            authorsIds: [validAuthorId.toString(), validAuthorIdTwo.toString()],
        };
        const bookModel = BookModel.create(validCreateBookDto);
        await setBook(bookModel);
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
            .post("/api/book/all/category")
            .expect(401);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTH_MIDDLEWARE.TOKEN_NOT_PROVIDED,
        });
        should(reply.status).deepEqual(401);
    });

    it("invalid token (auth)", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/all/category")
            .set("Authorization", "Bearer invalid_token")
            .expect(401);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTH_MIDDLEWARE.INVALID_TOKEN,
        });
        should(reply.status).deepEqual(401);
    });

    it("category not string", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/all/category")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                category: null,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.CATEGORY_NOT_STRING,
        });
        should(reply.status).deepEqual(400);
    });

    it("category empty", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/all/category")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
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
            .post("/api/book/all/category")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                category: "invalid_category",
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.INVALID_CATEGORY,
        });
        should(reply.status).deepEqual(400);
    });

    it("success", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/all/category")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                category: "Non",
            })
            .expect(200);

        should(reply.body).deepEqual([
            {
                ...validCreateBookDto,
                id: reply.body[0].id,
            },
        ]);
        should(reply.status).deepEqual(200);
    });
});
