import {FastifyInstance} from "fastify";
import {clearUsers, dispose, init, setUser, validAuthenticationDto, validCreateUserDto} from "../../TestHelper";
import request from "supertest";
import should from "should";
import {UserModel} from "../../../src/model/UserModel";

describe("auth.test", () => {
    let app: FastifyInstance;

    before(async () => {
        app = await init();
        await clearUsers();
    });

    after(async () => {
        await dispose();
    });

    it("empty email", async () => {
       const server = app.server;
       const dto = {
           ...validAuthenticationDto,
           email: "",
       };

       const reply = await request(server)
           .post("/api/signin")
           .send(dto)
           .expect(401);

       should(reply.body).deepEqual({
           message: "invalid_password_or_email",
       });
       should(reply.status).deepEqual(401);
    });

    it("null email", async () => {
        const server = app.server;
        const dto = {
            ...validAuthenticationDto,
            email: null,
        };

        const reply = await request(server)
            .post("/api/signin")
            .send(dto)
            .expect(401);

        should(reply.body).deepEqual({
            message: "email_not_string",
        });
        should(reply.status).deepEqual(401);
    });

    it("empty password", async () => {
        const server = app.server;
        const dto = {
            ...validAuthenticationDto,
            password: "",
        };

        const reply = await request(server)
            .post("/api/signin")
            .send(dto)
            .expect(401);

        should(reply.body).deepEqual({
            message: "invalid_password_or_email",
        });
        should(reply.status).deepEqual(401);
    });

    it("null password", async () => {
        const server = app.server;
        const dto = {
            ...validAuthenticationDto,
            password: null,
        };

        const reply = await request(server)
            .post("/api/signin")
            .send(dto)
            .expect(401);

        should(reply.body).deepEqual({
            message: "password_not_string",
        });
        should(reply.status).deepEqual(401);
    });

    it("invalid login or password", async () => {
        const server = app.server;
        const dto = {
            email: "email@gmail.com",
            password: "password",
        };

        const reply = await request(server)
            .post("/api/signin")
            .send(dto)
            .expect(401);

        should(reply.body).deepEqual({
            message: "invalid_password_or_email",
        });
        should(reply.status).deepEqual(401);
    });

    it("success", async () => {
        const user = UserModel.create(validCreateUserDto);
        await setUser(user);
        const server = app.server;

        const reply = await request(server)
            .post("/api/signin")
            .send(validAuthenticationDto)
            .expect(200);

        should(typeof reply.body.token).be.exactly("string");
        should(reply.status).deepEqual(200);
        await clearUsers();
    });
});
