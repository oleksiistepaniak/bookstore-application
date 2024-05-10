import {FastifyInstance} from "fastify";
import {
    clearAuthors,
    clearUsers,
    dispose,
    getValidToken,
    init, setAuthor,
    setUser,
    validCreateAuthorDto, validCreateAuthorDtoTwo,
    validCreateUserDto
} from "../../TestHelper";
import {UserModel} from "../../../src/model/UserModel";
import {AuthorModel} from "../../../src/model/AuthorModel";
import request from "supertest";
import should from "should";
import {ApiMessages} from "../../../src/util/ApiMessages";

describe("find.authors.by.nationality.test", () => {
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
    });

    after(async () => {
        await clearAuthors();
        await clearUsers();
        await dispose();
    });

    it("token not provided (auth)", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/all/nationality")
            .expect(401);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTH_MIDDLEWARE.TOKEN_NOT_PROVIDED,
        });
        should(reply.status).deepEqual(401);
    });

    it("invalid token (auth)", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/all/nationality")
            .set("Authorization", "Bearer invalid_token")
            .expect(401);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTH_MIDDLEWARE.INVALID_TOKEN,
        });
        should(reply.status).deepEqual(401);
    });

    it("nationality not string", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/all/nationality")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                nationality: null,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.NATIONALITY_NOT_STRING,
        });
        should(reply.status).deepEqual(400);
    });

    it("nationality empty", async () => {
       const server = app.server;

       const reply = await request(server)
           .post("/api/author/all/nationality")
           .set("Authorization", `Bearer ${validToken}`)
           .send({
               nationality: "",
           })
           .expect(400);

       should(reply.body).deepEqual({
           message: ApiMessages.AUTHOR.INVALID_NATIONALITY,
       });
       should(reply.status).deepEqual(400);
    });

    it("invalid nationality", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/all/nationality")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                nationality: ApiMessages.AUTHOR.INVALID_NATIONALITY,
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
            .post("/api/author/all/nationality")
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
            },
        ]);
        should(reply.status).deepEqual(200);
    });
});