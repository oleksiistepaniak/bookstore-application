import {FastifyInstance} from "fastify";
import {
    clearAuthors,
    clearUsers, dispose,
    getValidToken,
    init,
    setAuthor,
    setUser, validAuthenticationDto, validAuthenticationDtoTwo,
    validCreateAuthorDto,
    validCreateUserDto, validCreateUserDtoTwo
} from "../../TestHelper";
import {UserModel} from "../../../src/model/UserModel";
import {AuthorModel} from "../../../src/model/AuthorModel";
import should from "should";
import request from "supertest";
import {ApiMessages} from "../../../src/util/ApiMessages";

describe("remove.author.test", () => {
    let app: FastifyInstance;
    let firstValidToken: string;
    let secondValidToken: string;
    let validUserId: string;
    let validAuthorId: string;
    const nonExistsAuthorId = "663d343828ab341641086570";

    before(async () => {
        app = await init();
        await clearUsers();
        const firstUserModel = UserModel.create(validCreateUserDto);
        await setUser(firstUserModel);
        const secondUserModel = UserModel.create(validCreateUserDtoTwo);
        await setUser(secondUserModel);
        validUserId = firstUserModel.id.toString();
        const firstTokenReply = await getValidToken(validAuthenticationDto);
        firstValidToken = firstTokenReply.token;
        const secondTokenReply = await getValidToken(validAuthenticationDtoTwo);
        secondValidToken = secondTokenReply.token;
    });

    beforeEach(async () => {
        const authorModel = AuthorModel.create(validCreateAuthorDto, validUserId);
        await setAuthor(authorModel);
        validAuthorId = authorModel.id.toString();
    });

    afterEach(async () => {
        await clearAuthors();
    });

    after(async () => {
        await clearAuthors();
        await clearUsers();
        await dispose();
    });

    it("token not provided (auth)", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/remove")
            .expect(401);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTH_MIDDLEWARE.TOKEN_NOT_PROVIDED,
        });
        should(reply.status).deepEqual(401);
    });

    it("invalid token (auth)", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/remove")
            .set("Authorization", "Bearer invalid_token")
            .expect(401);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTH_MIDDLEWARE.INVALID_TOKEN,
        });
        should(reply.status).deepEqual(401);
    });

    it("invalid author id", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/remove")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: "invalid_author_id",
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.INVALID_AUTHOR_ID,
        });
        should(reply.status).deepEqual(400);
    });

    it("author not found", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/remove")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: nonExistsAuthorId,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.AUTHOR_NOT_FOUND,
        });
        should(reply.status).deepEqual(400);
    });

    it("invalid user", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/remove")
            .set("Authorization", `Bearer ${secondValidToken}`)
            .send({
                id: validAuthorId,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.INVALID_USER,
        });
        should(reply.status).deepEqual(400);
    });

    it("success", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/remove")
            .set("Authorization", `Bearer ${firstValidToken}`)
            .send({
                id: validAuthorId,
            })
            .expect(200);

        should(reply.body).deepEqual({
            ...validCreateAuthorDto,
            id: validAuthorId,
            userCreatorId: validUserId,
        });
        should(reply.status).deepEqual(200);
    });
});
