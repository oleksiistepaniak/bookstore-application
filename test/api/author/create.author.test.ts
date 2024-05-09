import {FastifyInstance} from "fastify";
import {
    clearUsers,
    dispose,
    getValidToken,
    init,
    setUser,
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

    before(async () => {
        app = await init();
        await clearUsers();
        const userModel = UserModel.create(validCreateUserDto);
        await setUser(userModel);
        const tokenReplyDto = await getValidToken();
        validToken = tokenReplyDto.token;
    });

    after(async () => {
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
       });
       should(reply.status).deepEqual(200);
    });
});
