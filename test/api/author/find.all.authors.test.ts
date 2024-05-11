import {FastifyInstance} from "fastify";
import {
    clearAuthors,
    clearUsers,
    dispose,
    getValidToken,
    init,
    setAuthor,
    setUser,
    validCreateAuthorDto, validCreateAuthorDtoEight,
    validCreateAuthorDtoFive,
    validCreateAuthorDtoFour,
    validCreateAuthorDtoNine,
    validCreateAuthorDtoSeven,
    validCreateAuthorDtoSix,
    validCreateAuthorDtoTen,
    validCreateAuthorDtoThree,
    validCreateAuthorDtoTwo,
    validCreateUserDto
} from "../../TestHelper";
import {UserModel} from "../../../src/model/UserModel";
import {AuthorModel} from "../../../src/model/AuthorModel";
import request from "supertest";
import should from "should";
import {ApiMessages} from "../../../src/util/ApiMessages";

describe("find.all.authors.test", () => {
    let app: FastifyInstance;
    let validToken: string;

    before(async () => {
        app = await init();
        await clearUsers();
        const userModel = UserModel.create(validCreateUserDto);
        await setUser(userModel);
        const tokenReplyDto = await getValidToken();
        validToken = tokenReplyDto.token;
        const firstAuthor = AuthorModel.create(validCreateAuthorDto);
        await setAuthor(firstAuthor);
        const secondAuthor = AuthorModel.create(validCreateAuthorDtoTwo);
        await setAuthor(secondAuthor);
        const thirdAuthor = AuthorModel.create(validCreateAuthorDtoThree);
        await setAuthor(thirdAuthor);
        const fourthAuthor = AuthorModel.create(validCreateAuthorDtoFour);
        await setAuthor(fourthAuthor);
        const fifthAuthor = AuthorModel.create(validCreateAuthorDtoFive);
        await setAuthor(fifthAuthor);
        const sixthAuthor = AuthorModel.create(validCreateAuthorDtoSix);
        await setAuthor(sixthAuthor);
        const seventhAuthor = AuthorModel.create(validCreateAuthorDtoSeven);
        await setAuthor(seventhAuthor);
        const eighthAuthor = AuthorModel.create(validCreateAuthorDtoEight);
        await setAuthor(eighthAuthor);
        const ninthAuthor = AuthorModel.create(validCreateAuthorDtoNine);
        await setAuthor(ninthAuthor);
        const tenthAuthor = AuthorModel.create(validCreateAuthorDtoTen);
        await setAuthor(tenthAuthor);
    });

    after(async () => {
        await clearAuthors();
        await clearUsers();
        await dispose();
    });

    it("token not provided (auth)", async () => {
       const server = app.server;

       const reply = await request(server)
           .post("/api/author/all")
           .expect(401);

       should(reply.body).deepEqual({
           message: ApiMessages.AUTH_MIDDLEWARE.TOKEN_NOT_PROVIDED,
       });
       should(reply.status).deepEqual(401);
    });

    it("invalid token (auth)", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/all")
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
            .post("/api/author/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                page: true,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.PAGE_NOT_NUMBER,
        });
        should(reply.status).deepEqual(400);
    });

    it("limit not number", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                limit: true,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.LIMIT_NOT_NUMBER,
        });
        should(reply.status).deepEqual(400);
    });

    it("name not string", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                name: true,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.NAME_NOT_STRING,
        });
        should(reply.status).deepEqual(400);
    });

    it("surname not string", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                surname: true,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.SURNAME_NOT_STRING,
        });
        should(reply.status).deepEqual(400);
    });

    it("biography not string", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                biography: true,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.BIOGRAPHY_NOT_STRING,
        });
        should(reply.status).deepEqual(400);
    });

    it("nationality not string", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                nationality: true,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.NATIONALITY_NOT_STRING,
        });
        should(reply.status).deepEqual(400);
    });

    it("success with only page", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                page: 1,
            })
            .expect(200);

        should(reply.body).deepEqual([
            {
                ...validCreateAuthorDto,
                id: reply.body[0].id,
            },
            {
                ...validCreateAuthorDtoTwo,
                id: reply.body[1].id,
            },
            {
                ...validCreateAuthorDtoThree,
                id: reply.body[2].id,
            },
            {
                ...validCreateAuthorDtoFour,
                id: reply.body[3].id,
            },
            {
                ...validCreateAuthorDtoFive,
                id: reply.body[4].id,
            },
            {
                ...validCreateAuthorDtoSix,
                id: reply.body[5].id,
            },
            {
                ...validCreateAuthorDtoSeven,
                id: reply.body[6].id,
            },
            {
                ...validCreateAuthorDtoEight,
                id: reply.body[7].id,
            },
            {
                ...validCreateAuthorDtoNine,
                id: reply.body[8].id,
            },
            {
                ...validCreateAuthorDtoTen,
                id: reply.body[9].id,
            },
        ]);
        should(reply.status).deepEqual(200);
    });

    it("success with only limit", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                limit: 2,
            })
            .expect(200);

        should(reply.body).deepEqual([
            {
                ...validCreateAuthorDto,
                id: reply.body[0].id,
            },
            {
                ...validCreateAuthorDtoTwo,
                id: reply.body[1].id,
            },
        ]);
        should(reply.status).deepEqual(200);
    });

    it("success with only name", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                name: "etro",
            })
            .expect(200);

        should(reply.body).deepEqual([
            {
                ...validCreateAuthorDto,
                id: reply.body[0].id,
            },
        ]);
        should(reply.status).deepEqual(200);
    });

    it("success with only surname", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                surname: "avchu",
            })
            .expect(200);

        should(reply.body).deepEqual([
            {
                ...validCreateAuthorDto,
                id: reply.body[0].id,
            },
        ]);
        should(reply.status).deepEqual(200);
    });

    it("success with only biography", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                biography: "UKRAINIAN AUTHOR",
            })
            .expect(200);

        should(reply.body).deepEqual([
            {
                ...validCreateAuthorDto,
                id: reply.body[0].id,
            },
        ]);
        should(reply.status).deepEqual(200);
    });

    it("success with only nationality", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                nationality: "Ukrainian",
            })
            .expect(200);

        should(reply.body).deepEqual([
            {
                ...validCreateAuthorDto,
                id: reply.body[0].id,
            },
            {
                ...validCreateAuthorDtoTwo,
                id: reply.body[1].id,
            }
        ]);
        should(reply.status).deepEqual(200);
    });

    it("success with limit and page", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                limit: 2,
                page: 3,
            })
            .expect(200);

        should(reply.body).deepEqual([
            {
                ...validCreateAuthorDtoFive,
                id: reply.body[0].id,
            },
            {
                ...validCreateAuthorDtoSix,
                id: reply.body[1].id,
            }
        ]);
        should(reply.status).deepEqual(200);
    });

    it("success with name and surname", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                name: "etr",
                surname: "avch",
            })
            .expect(200);

        should(reply.body).deepEqual([
            {
                ...validCreateAuthorDto,
                id: reply.body[0].id,
            },
        ]);
        should(reply.status).deepEqual(200);
    });

    it("success with name, surname, page and limit", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                name: "etr",
                surname: "avch",
                page: 1,
                limit: 1,
            })
            .expect(200);

        should(reply.body).deepEqual([
            {
                ...validCreateAuthorDto,
                id: reply.body[0].id,
            },
        ]);
        should(reply.status).deepEqual(200);
    });

    it("success with name, surname, biography", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                name: "etr",
                surname: "avch",
                biography: "UKRAINIAN AUTHOR",
            })
            .expect(200);

        should(reply.body).deepEqual([
            {
                ...validCreateAuthorDto,
                id: reply.body[0].id,
            },
        ]);
        should(reply.status).deepEqual(200);
    });

    it("success with name, biography and nationality", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                name: "etr",
                biography: "UKRAINIAN AUTHOR",
                nationality: "Ukrainian",
            })
            .expect(200);

        should(reply.body).deepEqual([
            {
                ...validCreateAuthorDto,
                id: reply.body[0].id,
            },
        ]);
        should(reply.status).deepEqual(200);
    });

    it("success without params", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({})
            .expect(200);

        should(reply.body).deepEqual([
            {
                ...validCreateAuthorDto,
                id: reply.body[0].id,
            },
            {
                ...validCreateAuthorDtoTwo,
                id: reply.body[1].id,
            },
            {
                ...validCreateAuthorDtoThree,
                id: reply.body[2].id,
            },
            {
                ...validCreateAuthorDtoFour,
                id: reply.body[3].id,
            },
            {
                ...validCreateAuthorDtoFive,
                id: reply.body[4].id,
            },
            {
                ...validCreateAuthorDtoSix,
                id: reply.body[5].id,
            },
            {
                ...validCreateAuthorDtoSeven,
                id: reply.body[6].id,
            },
            {
                ...validCreateAuthorDtoEight,
                id: reply.body[7].id,
            },
            {
                ...validCreateAuthorDtoNine,
                id: reply.body[8].id,
            },
            {
                ...validCreateAuthorDtoTen,
                id: reply.body[9].id,
            },
        ]);
        should(reply.status).deepEqual(200);
    });

    it("success with all params", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/all")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                page: 1,
                limit: 10,
                name: "a",
                surname: "o",
                biography: "a",
                nationality: "Ukrainian",
            })
            .expect(200);

        should(reply.body).deepEqual([
            {
                ...validCreateAuthorDtoTwo,
                id: reply.body[0].id,
            },
        ]);
        should(reply.status).deepEqual(200);
    });
});
