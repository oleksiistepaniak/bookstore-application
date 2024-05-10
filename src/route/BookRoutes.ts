import {app} from "../index";
import {authenticationMiddleware} from "../middleware/AuthenticationMiddleware";
import {BookController} from "../controllers/BookController";

export default async function bookRoutes() {
    app.post("/api/book/create", {
        preHandler: authenticationMiddleware,
        handler: BookController.instance.createBook,
    });
}
