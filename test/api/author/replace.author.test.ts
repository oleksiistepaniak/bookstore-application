import {FastifyInstance} from "fastify";
import {
    clearAuthors,
    clearUsers,
    dispose,
    getValidToken,
    init, setAuthor,
    setUser,
    validCreateAuthorDto,
    validCreateUserDto
} from "../../TestHelper";
import {UserModel} from "../../../src/model/UserModel";
import {AuthorModel} from "../../../src/model/AuthorModel";
import request from "supertest";
import should from "should";
import {ApiMessages} from "../../../src/util/ApiMessages";
import {Constants} from "../../../src/constants";

describe("replace.author.test", () => {
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
            .post("/api/author/replace")
            .expect(401);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTH_MIDDLEWARE.TOKEN_NOT_PROVIDED,
        });
        should(reply.status).deepEqual(401);
    });

    it("invalid token (auth)", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/replace")
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
            .post("/api/author/replace")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: validAuthorId,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.INVALID_AUTHOR_REPLACING,
        });
        should(reply.status).deepEqual(400);
    });

    it("name not string", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/replace")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: validAuthorId,
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
            .post("/api/author/replace")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: validAuthorId,
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
            .post("/api/author/replace")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: validAuthorId,
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
            .post("/api/author/replace")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: validAuthorId,
                nationality: true,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.NATIONALITY_NOT_STRING,
        });
        should(reply.status).deepEqual(400);
    });

    it("invalid author id", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/replace")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: "invalid_id",
                name: "string"
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.INVALID_AUTHOR_ID,
        });
        should(reply.status).deepEqual(400);
    });

    it("empty name", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/replace")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: validAuthorId,
                name: ""
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.INVALID_AUTHOR_REPLACING,
        });
        should(reply.status).deepEqual(400);
    });

    it("empty surname", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/replace")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: validAuthorId,
                surname: "",
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.INVALID_AUTHOR_REPLACING,
        });
        should(reply.status).deepEqual(400);
    });

    it("empty biography", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/replace")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: validAuthorId,
                biography: "",
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.INVALID_AUTHOR_REPLACING,
        });
        should(reply.status).deepEqual(400);
    });

    it("empty nationality", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/author/replace")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: validAuthorId,
                nationality: "",
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.INVALID_AUTHOR_REPLACING,
        });
        should(reply.status).deepEqual(400);
    });

    it("name length less than min required symbols", async () => {
        const server = app.server;
        const name = "a".repeat(Constants.AUTHOR.MIN_NAME_LENGTH - 1);

        const reply = await request(server)
            .post("/api/author/replace")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: validAuthorId,
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
            .post("/api/author/replace")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: validAuthorId,
                name,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.INVALID_NAME_LENGTH,
        });
        should(reply.status).deepEqual(400);
    });

    it("name not only latin chars", async () => {
        const server = app.server;
        const name = "Ж".repeat(Constants.AUTHOR.MIN_NAME_LENGTH);

        const reply = await request(server)
            .post("/api/author/replace")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: validAuthorId,
                name,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.ONLY_LATIN_CHARS_FOR_NAME,
        });
        should(reply.status).deepEqual(400);
    });

    it("surname less than min required symbols", async () => {
        const server = app.server;
        const surname = "a".repeat(Constants.AUTHOR.MIN_SURNAME_LENGTH - 1);

        const reply = await request(server)
            .post("/api/author/replace")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: validAuthorId,
                surname,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.INVALID_SURNAME_LENGTH,
        });
        should(reply.status).deepEqual(400);
    });

    it("surname more than max required symbols", async () => {
        const server = app.server;
        const surname = "a".repeat(Constants.AUTHOR.MAX_SURNAME_LENGTH + 1);

        const reply = await request(server)
            .post("/api/author/replace")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: validAuthorId,
                surname,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.INVALID_SURNAME_LENGTH,
        });
        should(reply.status).deepEqual(400);
    });

    it("surname not only latin chars", async () => {
        const server = app.server;
        const surname = "Ж".repeat(Constants.AUTHOR.MIN_SURNAME_LENGTH);

        const reply = await request(server)
            .post("/api/author/replace")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: validAuthorId,
                surname,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.ONLY_LATIN_CHARS_FOR_SURNAME,
        });
        should(reply.status).deepEqual(400);
    });

    it("biography length less than min required symbols", async () => {
        const server = app.server;
        const biography = "a".repeat(Constants.AUTHOR.MIN_BIOGRAPHY_LENGTH - 1);

        const reply = await request(server)
            .post("/api/author/replace")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: validAuthorId,
                biography,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.INVALID_BIOGRAPHY_LENGTH,
        });
        should(reply.status).deepEqual(400);
    });

    it("biography length more than max required symbols", async () => {
        const server = app.server;
        const biography = "a".repeat(Constants.AUTHOR.MAX_BIOGRAPHY_LENGTH + 1);

        const reply = await request(server)
            .post("/api/author/replace")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: validAuthorId,
                biography,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.INVALID_BIOGRAPHY_LENGTH,
        });
        should(reply.status).deepEqual(400);
    });

    it("biography not only latin chars", async () => {
        const server = app.server;
        const biography = "Ж".repeat(Constants.AUTHOR.MIN_BIOGRAPHY_LENGTH);

        const reply = await request(server)
            .post("/api/author/replace")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: validAuthorId,
                biography,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.ONLY_LATIN_CHARS_FOR_BIOGRAPHY,
        });
        should(reply.status).deepEqual(400);
    });

    it("invalid nationality", async () => {
        const server = app.server;
        const nationality = "invalid_nationality";

        const reply = await request(server)
            .post("/api/author/replace")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: validAuthorId,
                nationality,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.INVALID_NATIONALITY,
        });
        should(reply.status).deepEqual(400);
    });

    it("author not found", async () => {
        const server = app.server;
        const nationality = "Ukrainian";

        const reply = await request(server)
            .post("/api/author/replace")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: nonExistsAuthorId,
                nationality,
            })
            .expect(400);

        should(reply.body).deepEqual({
            message: ApiMessages.AUTHOR.AUTHOR_NOT_FOUND,
        });
        should(reply.status).deepEqual(400);
    });

    it("success with name", async () => {
        const server = app.server;
        const name = "a".repeat(Constants.AUTHOR.MIN_NAME_LENGTH);

        const reply = await request(server)
            .post("/api/author/replace")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: validAuthorId,
                name,
            })
            .expect(200);

        should(reply.body).deepEqual({
            ...validCreateAuthorDto,
            name,
            id: validAuthorId,
        });
        should(reply.status).deepEqual(200);
    });

    it("success with surname", async () => {
        const server = app.server;
        const surname = "a".repeat(Constants.AUTHOR.MIN_SURNAME_LENGTH);

        const reply = await request(server)
            .post("/api/author/replace")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: validAuthorId,
                surname,
            })
            .expect(200);

        should(reply.body).deepEqual({
            ...validCreateAuthorDto,
            surname,
            id: validAuthorId,
        });
        should(reply.status).deepEqual(200);
    });

    it("success with biography", async () => {
        const server = app.server;
        const biography = "a".repeat(Constants.AUTHOR.MIN_BIOGRAPHY_LENGTH);

        const reply = await request(server)
            .post("/api/author/replace")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: validAuthorId,
                biography,
            })
            .expect(200);

        should(reply.body).deepEqual({
            ...validCreateAuthorDto,
            biography,
            id: validAuthorId,
        });
        should(reply.status).deepEqual(200);
    });

    it("success with nationality", async () => {
        const server = app.server;
        const nationality = "Italian";

        const reply = await request(server)
            .post("/api/author/replace")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: validAuthorId,
                nationality,
            })
            .expect(200);

        should(reply.body).deepEqual({
            ...validCreateAuthorDto,
            nationality,
            id: validAuthorId,
        });
        should(reply.status).deepEqual(200);
    });

    it("success with name and surname", async () => {
        const server = app.server;
        const name = "a".repeat(Constants.AUTHOR.MIN_NAME_LENGTH);
        const surname = "a".repeat(Constants.AUTHOR.MIN_SURNAME_LENGTH);

        const reply = await request(server)
            .post("/api/author/replace")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: validAuthorId,
                name,
                surname,
            })
            .expect(200);

        should(reply.body).deepEqual({
            ...validCreateAuthorDto,
            name,
            surname,
            id: validAuthorId,
        });
        should(reply.status).deepEqual(200);
    });

    it("success with nationality and biography", async () => {
        const server = app.server;
        const biography = "a".repeat(Constants.AUTHOR.MIN_BIOGRAPHY_LENGTH);
        const nationality = "Italian";

        const reply = await request(server)
            .post("/api/author/replace")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: validAuthorId,
                biography,
                nationality,
            })
            .expect(200);

        should(reply.body).deepEqual({
            ...validCreateAuthorDto,
            biography,
            nationality,
            id: validAuthorId,
        });
        should(reply.status).deepEqual(200);
    });

    it("success with all params", async () => {
        const server = app.server;
        const biography = "a".repeat(Constants.AUTHOR.MIN_BIOGRAPHY_LENGTH);
        const nationality = "Italian";
        const name = "a".repeat(Constants.AUTHOR.MIN_NAME_LENGTH);
        const surname = "a".repeat(Constants.AUTHOR.MIN_SURNAME_LENGTH);

        const reply = await request(server)
            .post("/api/author/replace")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                id: validAuthorId,
                biography,
                nationality,
                name,
                surname,
            })
            .expect(200);

        should(reply.body).deepEqual({
            ...validCreateAuthorDto,
            biography,
            nationality,
            name,
            surname,
            id: validAuthorId,
        });
        should(reply.status).deepEqual(200);
    });
});
