import {FastifyInstance} from "fastify";
import {
    clearAuthors,
    clearUsers, dispose,
    getValidToken,
    init,
    setAuthor,
    setUser,
    validCreateAuthorDto,
    validCreateUserDto
} from "../../TestHelper";
import {UserModel} from "../../../src/model/UserModel";
import {AuthorModel} from "../../../src/model/AuthorModel";
import should from "should";
import request from "supertest";
import {ApiMessages} from "../../../src/util/ApiMessages";

describe("remove.author.test", () => {
    let app: FastifyInstance;
    let validToken: string;
    let validAuthorId: string;
    const nonExistsAuthorId = "663d343828ab341641086570";

    before(async () => {
        app = await init();
        await clearUsers();
        const userModel = UserModel.create(validCreateUserDto);
        await setUser(userModel);
        const tokenReplyDto = await getValidToken();
        validToken = tokenReplyDto.token;
    });

    beforeEach(async () => {
        const authorModel = AuthorModel.create(validCreateAuthorDto);
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
            .set("Authorization", `Bearer ${validToken}`)
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
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: nonExistsAuthorId,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.AUTHOR_NOT_FOUND,
        });
        should(reply.status).deepEqual(400);
    });

    it("success", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/remove")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: validAuthorId,
            })
            .expect(200);

        should(reply.body).deepEqual({
            ...validCreateAuthorDto,
            id: validAuthorId,
        });
        should(reply.status).deepEqual(200);
    });
});
