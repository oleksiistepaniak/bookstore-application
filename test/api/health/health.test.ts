import request from "supertest";
import {FastifyInstance} from "fastify";
import {dispose, init} from "../../TestHelper";
import should from "should";

describe("health.test", () => {
    let app: FastifyInstance;

    before(async () => {
        app = await init();
    });

    after(async () => {
        await dispose();
    });

    it("success", async () => {
        const server = app.server;
        const reply = await request(server)
            .get("/health")
            .expect(200);

        should(reply.body).deepEqual({
            message: "Everything is working!",
        });
        should(reply.status).deepEqual(200);
    })
});