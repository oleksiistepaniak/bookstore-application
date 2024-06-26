import {FastifyInstance} from "fastify";
import {ObjectId} from "mongodb";
import {CreateBookDto} from "../../../src/dto/book/CreateBookDto";
import {
    clearAuthors,
    clearBooks,
    clearUsers, dispose,
    getValidToken,
    init, setAuthor, setBook,
    setUser, validAuthenticationDto,
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

describe("find.all.books.test", () => {
    let app: FastifyInstance;
    let validToken: string;
    let validUserId: string;
    let validAuthorId: ObjectId;
    let validAuthorIdTwo: ObjectId;
    let firstCreateBookDto: CreateBookDto;
    let secondCreateBookDto: CreateBookDto;
    let thirdCreateBookDto: CreateBookDto;
    let fourthCreateBookDto: CreateBookDto;
    let fifthCreateBookDto: CreateBookDto;
    let sixthCreateBookDto: CreateBookDto;
    let seventhCreateBookDto: CreateBookDto;
    let eighthCreateBookDto: CreateBookDto;
    let ninthCreateBookDto: CreateBookDto;
    let tenthCreateBookDto: CreateBookDto;

    before(async () => {
        app = await init();
        await clearUsers();
        await clearBooks();
        await clearAuthors();
        const userModel = UserModel.create(validCreateUserDto);
        await setUser(userModel);
        validUserId = userModel.id.toString();
        const tokenReplyDto = await getValidToken(validAuthenticationDto);
        validToken = tokenReplyDto.token;
        const firstAuthor = AuthorModel.create(validCreateAuthorDto, validUserId);
        const secondAuthor = AuthorModel.create(validCreateAuthorDtoTwo, validUserId);
        await setAuthor(firstAuthor);
        await setAuthor(secondAuthor);
        validAuthorId = firstAuthor.id;
        validAuthorIdTwo = secondAuthor.id;
        firstCreateBookDto = {
            title: "How to quickly learn C++? Full guide and instructions!",
            description: "This book guides you how to learn C++ more efficiently and dive into more complex" +
                " algorithms and data structures! So, let's do it together!",
            category: EBookCategory.NON.toString(),
            numberOfPages: 354,
            authorsIds: [validAuthorId.toString(), validAuthorIdTwo.toString()],
        };
        secondCreateBookDto = {
            title: "History of Europe: full stories of unbelievable!",
            description: "This book contains full history of Europe from the ancient times to the modern times!",
            category: EBookCategory.HISTORICAL_FICTION.toString(),
            numberOfPages: 232,
            authorsIds: [validAuthorId.toString()],
        };
        thirdCreateBookDto = {
            title: "Taras Shevchenko: full biography of the legendary poet!",
            description: "This book contains full biography of the legendary Ukrainian poet, who was born in 1814!",
            category: EBookCategory.BIOGRAPHY.toString(),
            numberOfPages: 323,
            authorsIds: [validAuthorId.toString()],
        };
        fourthCreateBookDto = {
            title: "Guide to Machine Learning with Python",
            description: "This book provides a comprehensive guide to machine learning using Python.",
            category: EBookCategory.NON.toString(),
            numberOfPages: 420,
            authorsIds: [validAuthorId.toString()],
        };
        fifthCreateBookDto = {
            title: "The Art of Cooking: A Culinary Journey",
            description: "Explore the world of culinary arts with this comprehensive guide to cooking techniques and recipes.",
            category: EBookCategory.NON.toString(),
            numberOfPages: 280,
            authorsIds: [validAuthorIdTwo.toString()],
        };
        sixthCreateBookDto = {
            title: "The Power of Positive Thinking and Learning",
            description: "Discover the transformative power of positive thinking and how it can change your life.",
            category: EBookCategory.SELF_HELP.toString(),
            numberOfPages: 320,
            authorsIds: [validAuthorId.toString(), validAuthorIdTwo.toString()],
        };
        seventhCreateBookDto = {
            title: "The Adventures of Sherlock Holmes",
            description: "Join Sherlock Holmes and Dr. Watson on their thrilling adventures solving mysteries in Victorian London.",
            category: EBookCategory.MYSTERY.toString(),
            numberOfPages: 350,
            authorsIds: [validAuthorId.toString()],
        };
        eighthCreateBookDto = {
            title: "Financial Freedom: A Practical Guide",
            description: "Learn how to achieve financial freedom and take control of your financial future with this practical guide.",
            category: EBookCategory.NON.toString(),
            numberOfPages: 300,
            authorsIds: [validAuthorIdTwo.toString()],
        };
        ninthCreateBookDto = {
            title: "The Science of Meditation",
            description: "Explore the science behind meditation and its profound effects on the mind, body, and spirit.",
            category: EBookCategory.SELF_HELP.toString(),
            numberOfPages: 260,
            authorsIds: [validAuthorId.toString(), validAuthorIdTwo.toString()],
        };
        tenthCreateBookDto = {
            title: "The Complete Guide to Gardening",
            description: "Transform your outdoor space with this comprehensive guide to gardening techniques and tips.",
            category: EBookCategory.SELF_HELP.toString(),
            numberOfPages: 320,
            authorsIds: [validAuthorIdTwo.toString()],
        };
        const firstBook = BookModel.create(firstCreateBookDto, validUserId);
        await setBook(firstBook);
        const secondBook = BookModel.create(secondCreateBookDto, validUserId);
        await setBook(secondBook);
        const thirdBook = BookModel.create(thirdCreateBookDto, validUserId);
        await setBook(thirdBook);
        const fourthBook = BookModel.create(fourthCreateBookDto, validUserId);
        await setBook(fourthBook);
        const fifthBook = BookModel.create(fifthCreateBookDto, validUserId);
        await setBook(fifthBook);
        const sixthBook = BookModel.create(sixthCreateBookDto, validUserId);
        await setBook(sixthBook);
        const seventhBook = BookModel.create(seventhCreateBookDto, validUserId);
        await setBook(seventhBook);
        const eighthBook = BookModel.create(eighthCreateBookDto, validUserId);
        await setBook(eighthBook);
        const ninthBook = BookModel.create(ninthCreateBookDto, validUserId);
        await setBook(ninthBook);
        const tenthBook = BookModel.create(tenthCreateBookDto, validUserId);
        await setBook(tenthBook);
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
            .post("/api/book/all")
            .expect(401);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTH_MIDDLEWARE.TOKEN_NOT_PROVIDED,
        });
        should(reply.status).deepEqual(401);
    });

    it("invalid token (auth)", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/all")
            .set("Authorization", "Bearer invalid_token")
            .expect(401);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTH_MIDDLEWARE.INVALID_TOKEN,
        });
        should(reply.status).deepEqual(401);
    });

    it("page not number", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                page: true,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.PAGE_NOT_NUMBER,
        });
        should(reply.status).deepEqual(400);
    });

    it("limit not number", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                limit: true,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.LIMIT_NOT_NUMBER,
        });
        should(reply.status).deepEqual(400);
    });

    it("minNumberOfPages not number", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                minNumberOfPages: true,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.MIN_NUMBER_OF_PAGES_NOT_NUMBER,
        });
        should(reply.status).deepEqual(400);
    });

    it("maxNumberOfPages not number", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                maxNumberOfPages: true,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.MAX_NUMBER_OF_PAGES_NOT_NUMBER,
        });
        should(reply.status).deepEqual(400);
    });

    it("title not string", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
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
            .post("/api/book/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
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
            .post("/api/book/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                category: true,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.CATEGORY_NOT_STRING,
        });
        should(reply.status).deepEqual(400);
    });

    it("authors ids not string array", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                authorsIds: true,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.INVALID_AUTHORS_IDS_ARRAY,
        });
        should(reply.status).deepEqual(400);
    });

    it("one of authorsIds not string", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                authorsIds: [true],
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.AUTHOR_ID_NOT_STRING,
        });
        should(reply.status).deepEqual(400);
    });

    it("invalid author id", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                authorsIds: ["invalid_author_id"],
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.BOOK.INVALID_AUTHOR_ID,
        });
        should(reply.status).deepEqual(400);
    });

    it("success only page", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                page: 1,
            })
            .expect(200);

        should(reply.body).deepEqual([
            {
                ...firstCreateBookDto,
                id: reply.body[0].id,
                userCreatorId: validUserId,
            },
            {
                ...secondCreateBookDto,
                id: reply.body[1].id,
                userCreatorId: validUserId,
            },
            {
                ...thirdCreateBookDto,
                id: reply.body[2].id,
                userCreatorId: validUserId,
            },
            {
                ...fourthCreateBookDto,
                id: reply.body[3].id,
                userCreatorId: validUserId,
            },
            {
                ...fifthCreateBookDto,
                id: reply.body[4].id,
                userCreatorId: validUserId,
            },
            {
                ...sixthCreateBookDto,
                id: reply.body[5].id,
                userCreatorId: validUserId,
            },
            {
                ...seventhCreateBookDto,
                id: reply.body[6].id,
                userCreatorId: validUserId,
            },
            {
                ...eighthCreateBookDto,
                id: reply.body[7].id,
                userCreatorId: validUserId,
            },
            {
                ...ninthCreateBookDto,
                id: reply.body[8].id,
                userCreatorId: validUserId,
            },
            {
                ...tenthCreateBookDto,
                id: reply.body[9].id,
                userCreatorId: validUserId,
            }
        ]);
        should(reply.status).deepEqual(200);
    });

    it("success only limit", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                limit: 2,
            })
            .expect(200);

        should(reply.body).deepEqual([
            {
                ...firstCreateBookDto,
                id: reply.body[0].id,
                userCreatorId: validUserId,
            },
            {
                ...secondCreateBookDto,
                id: reply.body[1].id,
                userCreatorId: validUserId,
            },
        ]);
        should(reply.status).deepEqual(200);
    });

    it("success with only minNumberOfPages", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                minNumberOfPages: 400,
            })
            .expect(200);

        should(reply.body).deepEqual([
            {
                ...fourthCreateBookDto,
                id: reply.body[0].id,
                userCreatorId: validUserId,
            },
        ]);
        should(reply.status).deepEqual(200);
    });

    it("success with only maxNumberOfPages", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                maxNumberOfPages: 235,
            })
            .expect(200);

        should(reply.body).deepEqual([
            {
                ...secondCreateBookDto,
                id: reply.body[0].id,
                userCreatorId: validUserId,
            },
        ]);
        should(reply.status).deepEqual(200);
    });

    it("success with only title", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                title: "SHEVCHENKO",
            })
            .expect(200);

        should(reply.body).deepEqual([
            {
                ...thirdCreateBookDto,
                id: reply.body[0].id,
                userCreatorId: validUserId,
            },
        ]);
        should(reply.status).deepEqual(200);
    });

    it("success with only description", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                description: "1814",
            })
            .expect(200);

        should(reply.body).deepEqual([
            {
                ...thirdCreateBookDto,
                id: reply.body[0].id,
                userCreatorId: validUserId,
            },
        ]);
        should(reply.status).deepEqual(200);
    });

    it("success with minNumberOfPages and maxNumberOfPages", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                minNumberOfPages: 230,
                maxNumberOfPages: 260,
            })
            .expect(200);

        should(reply.body).deepEqual([
            {
                ...secondCreateBookDto,
                id: reply.body[0].id,
                userCreatorId: validUserId,
            },
            {
                ...ninthCreateBookDto,
                id: reply.body[1].id,
                userCreatorId: validUserId,
            },
        ]);
        should(reply.status).deepEqual(200);
    });

    it("success with title and description", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                title: "SHEVCHENKO",
                description: "1814",
            })
            .expect(200);

        should(reply.body).deepEqual([
            {
                ...thirdCreateBookDto,
                id: reply.body[0].id,
                userCreatorId: validUserId,
            },
        ]);
        should(reply.status).deepEqual(200);
    });

    it("success with limit and page", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                page: 3,
                limit: 2,
            })
            .expect(200);

        should(reply.body).deepEqual([
            {
                ...fifthCreateBookDto,
                id: reply.body[0].id,
                userCreatorId: validUserId,
            },
            {
                ...sixthCreateBookDto,
                id: reply.body[1].id,
                userCreatorId: validUserId,
            },
        ]);
        should(reply.status).deepEqual(200);
    });

    it("success with only authorsIds", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                authorsIds: [validAuthorIdTwo.toString()]
            })
            .expect(200);

        should(reply.body).deepEqual([
            {
                ...firstCreateBookDto,
                id: reply.body[0].id,
                userCreatorId: validUserId,
            },
            {
                ...fifthCreateBookDto,
                id: reply.body[1].id,
                userCreatorId: validUserId,
            },
            {
                ...sixthCreateBookDto,
                id: reply.body[2].id,
                userCreatorId: validUserId,
            },
            {
                ...eighthCreateBookDto,
                id: reply.body[3].id,
                userCreatorId: validUserId,
            },
            {
                ...ninthCreateBookDto,
                id: reply.body[4].id,
                userCreatorId: validUserId,
            },
            {
                ...tenthCreateBookDto,
                id: reply.body[5].id,
                userCreatorId: validUserId,
            },
        ]);
        should(reply.status).deepEqual(200);
    });

    it("success with authorsIds, limit and page", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                authorsIds: [validAuthorIdTwo.toString()],
                limit: 2,
                page: 2,
            })
            .expect(200);

        should(reply.body).deepEqual([
            {
                ...sixthCreateBookDto,
                id: reply.body[0].id,
                userCreatorId: validUserId,
            },
            {
                ...eighthCreateBookDto,
                id: reply.body[1].id,
                userCreatorId: validUserId,
            },
        ]);
        should(reply.status).deepEqual(200);
    });

    it("success with only category", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                category: EBookCategory.BIOGRAPHY.toString(),
            })
            .expect(200);

        should(reply.body).deepEqual([
            {
                ...thirdCreateBookDto,
                id: reply.body[0].id,
                userCreatorId: validUserId,
            },
        ]);
        should(reply.status).deepEqual(200);
    });

    it("success with category, title and description", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                title: "SHEVCHENKO",
                description: "1814",
                category: EBookCategory.BIOGRAPHY.toString(),
            })
            .expect(200);

        should(reply.body).deepEqual([
            {
                ...thirdCreateBookDto,
                id: reply.body[0].id,
                userCreatorId: validUserId,
            },
        ]);
        should(reply.status).deepEqual(200);
    });

    it("success without params", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({})
            .expect(200);

        should(reply.body).deepEqual([
            {
                ...firstCreateBookDto,
                id: reply.body[0].id,
                userCreatorId: validUserId,
            },
            {
                ...secondCreateBookDto,
                id: reply.body[1].id,
                userCreatorId: validUserId,
            },
            {
                ...thirdCreateBookDto,
                id: reply.body[2].id,
                userCreatorId: validUserId,
            },
            {
                ...fourthCreateBookDto,
                id: reply.body[3].id,
                userCreatorId: validUserId,
            },
            {
                ...fifthCreateBookDto,
                id: reply.body[4].id,
                userCreatorId: validUserId,
            },
            {
                ...sixthCreateBookDto,
                id: reply.body[5].id,
                userCreatorId: validUserId,
            },
            {
                ...seventhCreateBookDto,
                id: reply.body[6].id,
                userCreatorId: validUserId,
            },
            {
                ...eighthCreateBookDto,
                id: reply.body[7].id,
                userCreatorId: validUserId,
            },
            {
                ...ninthCreateBookDto,
                id: reply.body[8].id,
                userCreatorId: validUserId,
            },
            {
                ...tenthCreateBookDto,
                id: reply.body[9].id,
                userCreatorId: validUserId,
            }
        ]);
        should(reply.status).deepEqual(200);
    });

    it("success with all params", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/book/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                page: 1,
                limit: 10,
                minNumberOfPages: 100,
                maxNumberOfPages: 1000,
                title: "a",
                description: "a",
            })
            .expect(200);

        should(reply.body).deepEqual([
            {
                ...firstCreateBookDto,
                id: reply.body[0].id,
                userCreatorId: validUserId,
            },
            {
                ...secondCreateBookDto,
                id: reply.body[1].id,
                userCreatorId: validUserId,
            },
            {
                ...thirdCreateBookDto,
                id: reply.body[2].id,
                userCreatorId: validUserId,
            },
            {
                ...fourthCreateBookDto,
                id: reply.body[3].id,
                userCreatorId: validUserId,
            },
            {
                ...fifthCreateBookDto,
                id: reply.body[4].id,
                userCreatorId: validUserId,
            },
            {
                ...sixthCreateBookDto,
                id: reply.body[5].id,
                userCreatorId: validUserId,
            },
            {
                ...seventhCreateBookDto,
                id: reply.body[6].id,
                userCreatorId: validUserId,
            },
            {
                ...eighthCreateBookDto,
                id: reply.body[7].id,
                userCreatorId: validUserId,
            },
            {
                ...ninthCreateBookDto,
                id: reply.body[8].id,
                userCreatorId: validUserId,
            },
            {
                ...tenthCreateBookDto,
                id: reply.body[9].id,
                userCreatorId: validUserId,
            }
        ]);
        should(reply.status).deepEqual(200);
    });
});
