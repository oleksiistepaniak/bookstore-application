import {app} from "../index";
import {authenticationMiddleware} from "../middleware/AuthenticationMiddleware";
import {BookController} from "../controller/BookController";

export default async function bookRoutes() {
    app.post("/api/book/create", {
        preHandler: authenticationMiddleware,
        handler: BookController.instance.createBook,
    });

    app.post("/api/book/all", {
        preHandler: authenticationMiddleware,
        handler: BookController.instance.findAllBooks,
    });

    app.post("/api/book/replace", {
        preHandler: authenticationMiddleware,
        handler: BookController.instance.replaceBook,
    });

    app.post("/api/book/remove", {
        preHandler: authenticationMiddleware,
        handler: BookController.instance.removeBook,
    });
}
