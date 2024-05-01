import request from "supertest";
import {FastifyInstance} from "fastify";
import {init, dispose, validCreateUserDto, clearUsers, setUser} from "../../TestHelper";
import should from "should";
import {Constants} from "../../../src/constants";
import {UserModel} from "../../../src/model/UserModel";

describe('reg.test', () => {
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
            ...validCreateUserDto,
            email: "",
        }
        const reply = await request(server)
            .post("/api/signup")
            .send(dto)
            .expect(400);

        should(reply.body).deepEqual({
            message: "invalid_email",
        });
        should(reply.status).deepEqual(400);
    });

    it("null email", async () => {
        const server = app.server;
        const dto = {
            ...validCreateUserDto,
            email: null,
        };

        const reply = await request(server)
            .post("/api/signup")
            .send(dto)
            .expect(400);

        should(reply.body).deepEqual({
            message: "email_not_string",
        });
        should(reply.status).deepEqual(400);
    });

    it("invalid email", async () => {
       const server = app.server;
       const dto = {
           ...validCreateUserDto,
           email: "invalid_email",
       };

       const reply = await request(server)
           .post("/api/signup")
           .send(dto)
           .expect(400);

       should(reply.body).deepEqual({
           message: "invalid_email",
       });
       should(reply.status).deepEqual(400);
    });

    it("empty password", async () => {
        const server = app.server;
        const dto = {
            ...validCreateUserDto,
            password: "",
        };

        const reply = await request(server)
            .post("/api/signup")
            .send(dto)
            .expect(400);

        should(reply.body).deepEqual({
            message: "invalid_password",
        });
        should(reply.status).deepEqual(400);
    });

    it("null password", async () => {
        const server = app.server;
        const dto = {
            ...validCreateUserDto,
            password: null,
        };

        const reply = await request(server)
            .post("/api/signup")
            .send(dto)
            .expect(400);

        should(reply.body).deepEqual({
            message: "password_not_string",
        });
        should(reply.status).deepEqual(400);
    });

    it("password is less than min required symbols", async () => {
       const password = "a".repeat(Constants.MIN_PASSWORD_LENGTH - 1);
       const server = app.server;
       const dto = {
           ...validCreateUserDto,
           password,
       };

       const reply = await request(server)
           .post("/api/signup")
           .send(dto)
           .expect(400);

       should(reply.body).deepEqual({
           message: "invalid_password",
       });
       should(reply.status).deepEqual(400);
    });

    it("password is more than max required symbols", async () => {
       const password = "a".repeat(Constants.MAX_PASSWORD_LENGTH + 1);
       const server = app.server;
       const dto = {
           ...validCreateUserDto,
           password,
       };

        const reply = await request(server)
            .post("/api/signup")
            .send(dto)
            .expect(400);

        should(reply.body).deepEqual({
            message: "invalid_password",
        });
        should(reply.status).deepEqual(400);
    });

    it("only lowercase password", async () => {
        const password = "a".repeat(Constants.MIN_PASSWORD_LENGTH);
        const server = app.server;
        const dto = {
            ...validCreateUserDto,
            password,
        };

        const reply = await request(server)
            .post("/api/signup")
            .send(dto)
            .expect(400);

        should(reply.body).deepEqual({
            message: "invalid_password",
        });
        should(reply.status).deepEqual(400);
    });

    it("only uppercase password", async () => {
        const password = "A".repeat(Constants.MIN_PASSWORD_LENGTH);
        const server = app.server;
        const dto = {
            ...validCreateUserDto,
            password,
        };

        const reply = await request(server)
            .post("/api/signup")
            .send(dto)
            .expect(400);

        should(reply.body).deepEqual({
            message: "invalid_password",
        });
        should(reply.status).deepEqual(400);
    });

    it("only digits password", async () => {
        const password = "1".repeat(Constants.MIN_PASSWORD_LENGTH);
        const server = app.server;
        const dto = {
            ...validCreateUserDto,
            password,
        };

        const reply = await request(server)
            .post("/api/signup")
            .send(dto)
            .expect(400);

        should(reply.body).deepEqual({
            message: "invalid_password",
        });
        should(reply.status).deepEqual(400);
    });

    it("only digits and lowercase password", async () => {
        const password = "1".repeat(Constants.MIN_PASSWORD_LENGTH / 2) + "a".repeat(Constants.MIN_PASSWORD_LENGTH / 2);
        const server = app.server;
        const dto = {
            ...validCreateUserDto,
            password,
        };

        const reply = await request(server)
            .post("/api/signup")
            .send(dto)
            .expect(400);

        should(reply.body).deepEqual({
            message: "invalid_password",
        });
        should(reply.status).deepEqual(400);
    });

    it("only digits and uppercase password", async () => {
        const password = "1".repeat(Constants.MIN_PASSWORD_LENGTH / 2) + "A".repeat(Constants.MIN_PASSWORD_LENGTH / 2);
        const server = app.server;
        const dto = {
            ...validCreateUserDto,
            password,
        };

        const reply = await request(server)
            .post("/api/signup")
            .send(dto)
            .expect(400);

        should(reply.body).deepEqual({
            message: "invalid_password",
        });
        should(reply.status).deepEqual(400);
    });

    it("only lowercase and uppercase password", async () => {
        const password = "A".repeat(Constants.MIN_PASSWORD_LENGTH / 2) + "a".repeat(Constants.MIN_PASSWORD_LENGTH / 2);
        const server = app.server;
        const dto = {
            ...validCreateUserDto,
            password,
        };

        const reply = await request(server)
            .post("/api/signup")
            .send(dto)
            .expect(400);

        should(reply.body).deepEqual({
            message: "invalid_password",
        });
        should(reply.status).deepEqual(400);
    });

    it("empty first name", async () => {
        const server = app.server;
        const dto = {
            ...validCreateUserDto,
            firstName: "",
        };

        const reply = await request(server)
            .post("/api/signup")
            .send(dto)
            .expect(400);

        should(reply.body).deepEqual({
            message: "invalid_firstname",
        });
        should(reply.status).deepEqual(400);
    });

    it("null first name", async () => {
        const server = app.server;
        const dto = {
            ...validCreateUserDto,
            firstName: null,
        };

        const reply = await request(server)
            .post("/api/signup")
            .send(dto)
            .expect(400);

        should(reply.body).deepEqual({
            message: "firstname_not_string",
        });
        should(reply.status).deepEqual(400);
    });

    it("first name is less than min required symbols", async () => {
        const firstName = "a".repeat(Constants.USER.MIN_NAME_LENGTH - 1);
        const server = app.server;
        const dto = {
            ...validCreateUserDto,
            firstName,
        };

        const reply = await request(server)
            .post("/api/signup")
            .send(dto)
            .expect(400);

        should(reply.body).deepEqual({
            message: "invalid_firstname",
        });
        should(reply.status).deepEqual(400);
    });

    it("first name is more than max required symbols", async () => {
        const firstName = "a".repeat(Constants.USER.MAX_NAME_LENGTH + 1);
        const server = app.server;
        const dto = {
            ...validCreateUserDto,
            firstName,
        };

        const reply = await request(server)
            .post("/api/signup")
            .send(dto)
            .expect(400);

        should(reply.body).deepEqual({
            message: "invalid_firstname",
        });
        should(reply.status).deepEqual(400);
    });

    it("empty last name", async () => {
        const server = app.server;
        const dto = {
            ...validCreateUserDto,
            lastName: "",
        };

        const reply = await request(server)
            .post("/api/signup")
            .send(dto)
            .expect(400);

        should(reply.body).deepEqual({
            message: "invalid_lastname",
        });
        should(reply.status).deepEqual(400);
    });

    it("null last name", async () => {
        const server = app.server;
        const dto = {
            ...validCreateUserDto,
            lastName: null,
        };

        const reply = await request(server)
            .post("/api/signup")
            .send(dto)
            .expect(400);

        should(reply.body).deepEqual({
            message: "lastname_not_string",
        });
        should(reply.status).deepEqual(400);
    });

    it("last name is less than min required symbols", async () => {
        const lastName = "a".repeat(Constants.USER.MIN_NAME_LENGTH - 1);
        const server = app.server;
        const dto = {
            ...validCreateUserDto,
            lastName,
        };

        const reply = await request(server)
            .post("/api/signup")
            .send(dto)
            .expect(400);

        should(reply.body).deepEqual({
            message: "invalid_lastname",
        });
        should(reply.status).deepEqual(400);
    });

    it("last name is more than max required symbols", async () => {
        const lastName = "a".repeat(Constants.USER.MAX_NAME_LENGTH + 1);
        const server = app.server;
        const dto = {
            ...validCreateUserDto,
            lastName,
        };

        const reply = await request(server)
            .post("/api/signup")
            .send(dto)
            .expect(400);

        should(reply.body).deepEqual({
            message: "invalid_lastname",
        });
        should(reply.status).deepEqual(400);
    });

    it("null age", async () => {
        const server = app.server;
        const dto = {
            ...validCreateUserDto,
            age: null,
        };

        const reply = await request(server)
            .post("/api/signup")
            .send(dto)
            .expect(400);

        should(reply.body).deepEqual({
            message: "age_not_number",
        });
        should(reply.status).deepEqual(400);
    });

    it("age is less than min required", async () => {
        const age = Constants.USER.MIN_AGE_VALUE - 1;
        const server = app.server;
        const dto = {
            ...validCreateUserDto,
            age,
        };

        const reply = await request(server)
            .post("/api/signup")
            .send(dto)
            .expect(400);

        should(reply.body).deepEqual({
            message: "invalid_age",
        });
        should(reply.status).deepEqual(400);
    });

    it("age is more than max required", async () => {
        const age = Constants.USER.MAX_AGE_VALUE + 1;
        const server = app.server;
        const dto = {
            ...validCreateUserDto,
            age,
        };

        const reply = await request(server)
            .post("/api/signup")
            .send(dto)
            .expect(400);

        should(reply.body).deepEqual({
            message: "invalid_age",
        });
        should(reply.status).deepEqual(400);
    });

    it("user exists", async () => {
        const user = UserModel.create(validCreateUserDto);
        await setUser(user);
        const server = app.server;

        const reply = await request(server)
            .post("/api/signup")
            .send(validCreateUserDto)
            .expect(400);

        should(reply.body).deepEqual({
            message: "user_exists",
        });
        should(reply.status).deepEqual(400);
        await clearUsers();
    });

    it("success", async () => {
        const server = app.server;

        const reply = await request(server)
            .post("/api/signup")
            .send(validCreateUserDto)
            .expect(200);

        should(reply.body).deepEqual({
            id: reply.body.id,
            email: validCreateUserDto.email,
            firstName: validCreateUserDto.firstName,
            lastName: validCreateUserDto.lastName,
            age: validCreateUserDto.age,
        });
        should(reply.status).deepEqual(200);
        await clearUsers();
    });
});
