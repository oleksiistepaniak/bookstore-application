import {FastifyInstance} from "fastify";
import {
    clearAuthors,
    clearUsers,
    dispose,
    getValidToken,
    init,
    setUser, validAuthenticationDto,
    validCreateAuthorDto,
    validCreateUserDto
} from "../../TestHelper";
import request from "supertest";
import should from "should";
import {ApiMessages} from "../../../src/util/ApiMessages";
import {UserModel} from "../../../src/model/UserModel";
import {Constants} from "../../../src/constants";

describe("create.author.test", () => {
    let app: FastifyInstance;
    let validToken: string;
    let validUserId: string;

    before(async () => {
        app = await init();
        await clearUsers();
        const userModel = UserModel.create(validCreateUserDto);
        await setUser(userModel);
        validUserId = userModel.id.toString();
        const tokenReplyDto = await getValidToken(validAuthenticationDto);
        validToken = tokenReplyDto.token;
    });

    after(async () => {
        await clearAuthors();
        await clearUsers();
        await dispose();
    });

    it("token not provided (auth)", async () => {
       const server = app.server;

       const reply = await request(server)
           .post("/api/author/create")
           .expect(401);

       should(reply.body).deepEqual({
           message: ApiMessages.AUTH_MIDDLEWARE.TOKEN_NOT_PROVIDED,
       });
       should(reply.status).deepEqual(401);
    });

    it("invalid token (auth)", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/create")
            .set("Authorization", "Bearer invalid_token")
            .expect(401);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTH_MIDDLEWARE.INVALID_TOKEN,
        });
        should(reply.status).deepEqual(401);
    });

    it("name not string", async () => {
       const server = app.server;

       const reply = await request(server)
           .post("/api/author/create")
           .set("Authorization", `Bearer ${validToken}`)
           .send({
               ...validCreateAuthorDto,
               name: null,
           })
           .expect(400);

       should(reply.body).deepEqual({
           message: ApiMessages.AUTHOR.NAME_NOT_STRING,
       });
       should(reply.status).deepEqual(400);
    });

    it("empty name", async () => {
       const server = app.server;

       const reply = await request(server)
           .post("/api/author/create")
           .set("Authorization", `Bearer ${validToken}`)
           .send({
               ...validCreateAuthorDto,
               name: "",
           })
           .expect(400);

       should(reply.body).deepEqual({
           message: ApiMessages.AUTHOR.INVALID_NAME_LENGTH,
       });
       should(reply.status).deepEqual(400);
    });

    it("name length less than min required symbols", async () => {
        const server = app.server;
        const name = "a".repeat(Constants.AUTHOR.MIN_NAME_LENGTH - 1);

        const reply = await request(server)
            .post("/api/author/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateAuthorDto,
                name,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.INVALID_NAME_LENGTH,
        });
        should(reply.status).deepEqual(400);
    });

    it("name length more than max required symbols", async () => {
        const server = app.server;
        const name = "a".repeat(Constants.AUTHOR.MAX_NAME_LENGTH + 1);

        const reply = await request(server)
            .post("/api/author/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateAuthorDto,
                name,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.INVALID_NAME_LENGTH,
        });
        should(reply.status).deepEqual(400);
    });

    it("name not latin chars", async () => {
        const server = app.server;
        const name = "1".repeat(Constants.AUTHOR.MIN_NAME_LENGTH);

        const reply = await request(server)
            .post("/api/author/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateAuthorDto,
                name,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.ONLY_LATIN_CHARS_FOR_NAME,
        });
        should(reply.status).deepEqual(400);
    });

    it("invalid name chars", async () => {
        const server = app.server;
        const name = "+".repeat(Constants.AUTHOR.MIN_NAME_LENGTH);

        const reply = await request(server)
            .post("/api/author/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateAuthorDto,
                name,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.ONLY_LATIN_CHARS_FOR_NAME,
        });
        should(reply.status).deepEqual(400);
    });

    it("surname not string", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateAuthorDto,
                surname: null,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.SURNAME_NOT_STRING,
        });
        should(reply.status).deepEqual(400);
    });

    it("empty surname", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateAuthorDto,
                surname: "",
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.INVALID_SURNAME_LENGTH,
        });
        should(reply.status).deepEqual(400);
    });

    it("surname length less than min required symbols", async () => {
        const server = app.server;
        const surname = "a".repeat(Constants.AUTHOR.MIN_SURNAME_LENGTH - 1);

        const reply = await request(server)
            .post("/api/author/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateAuthorDto,
                surname,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.INVALID_SURNAME_LENGTH,
        });
        should(reply.status).deepEqual(400);
    });

    it("surname length more than max required symbols", async () => {
        const server = app.server;
        const surname = "a".repeat(Constants.AUTHOR.MAX_SURNAME_LENGTH + 1);

        const reply = await request(server)
            .post("/api/author/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateAuthorDto,
                surname,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.INVALID_SURNAME_LENGTH,
        });
        should(reply.status).deepEqual(400);
    });

    it("surname not latin chars", async () => {
        const server = app.server;
        const surname = "1".repeat(Constants.AUTHOR.MIN_SURNAME_LENGTH);

        const reply = await request(server)
            .post("/api/author/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateAuthorDto,
                surname,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.ONLY_LATIN_CHARS_FOR_SURNAME,
        });
        should(reply.status).deepEqual(400);
    });

    it("invalid surname chars", async () => {
        const server = app.server;
        const surname = "+".repeat(Constants.AUTHOR.MIN_SURNAME_LENGTH);

        const reply = await request(server)
            .post("/api/author/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateAuthorDto,
                surname,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.ONLY_LATIN_CHARS_FOR_SURNAME,
        });
        should(reply.status).deepEqual(400);
    });

    it("biography not string", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateAuthorDto,
                biography: null,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.BIOGRAPHY_NOT_STRING,
        });
        should(reply.status).deepEqual(400);
    });

    it("empty biography", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateAuthorDto,
                biography: "",
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.INVALID_BIOGRAPHY_LENGTH,
        });
        should(reply.status).deepEqual(400);
    });

    it("biography less than min required symbols", async () => {
        const server = app.server;
        const biography = "a".repeat(Constants.AUTHOR.MIN_BIOGRAPHY_LENGTH - 1);

        const reply = await request(server)
            .post("/api/author/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateAuthorDto,
                biography,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.INVALID_BIOGRAPHY_LENGTH,
        });
        should(reply.status).deepEqual(400);
    });

    it("biography more than max required symbols", async () => {
        const server = app.server;
        const biography = "a".repeat(Constants.AUTHOR.MAX_BIOGRAPHY_LENGTH + 1);

        const reply = await request(server)
            .post("/api/author/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateAuthorDto,
                biography,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.INVALID_BIOGRAPHY_LENGTH,
        });
        should(reply.status).deepEqual(400);
    });

    it("nationality not string", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateAuthorDto,
                nationality: null,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.NATIONALITY_NOT_STRING,
        });
        should(reply.status).deepEqual(400);
    });

    it("invalid nationality", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/create")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                ...validCreateAuthorDto,
                nationality: "invalid_nationality",
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.INVALID_NATIONALITY,
        });
        should(reply.status).deepEqual(400);
    });

    it("success", async () => {
       const server = app.server;

       const reply = await request(server)
           .post("/api/author/create")
           .set("Authorization", `Bearer ${validToken}`)
           .send({
               ...validCreateAuthorDto,
           })
           .expect(200);

       should(reply.body).deepEqual({
           ...validCreateAuthorDto,
           id: reply.body.id,
           userCreatorId: validUserId,
       });
       should(reply.status).deepEqual(200);
    });
});
