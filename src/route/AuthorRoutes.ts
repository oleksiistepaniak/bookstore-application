import {app} from "../index";
import {authenticationMiddleware} from "../middleware/AuthenticationMiddleware";
import {AuthorController} from "../controller/AuthorController";

export default async function authorRoutes() {
    app.post("/api/author/create", {
        preHandler: authenticationMiddleware,
        handler: AuthorController.instance.createAuthor,
    });

    app.post("/api/author/all", {
        preHandler: authenticationMiddleware,
        handler: AuthorController.instance.findAllAuthors,
    });

    app.post("/api/author/replace", {
        preHandler: authenticationMiddleware,
        handler: AuthorController.instance.replaceAuthor,
    });

    app.post("/api/author/remove", {
        preHandler: authenticationMiddleware,
        handler: AuthorController.instance.removeAuthor,
    });
}
