import {app} from "../index";
import {authenticationMiddleware} from "../middleware/AuthenticationMiddleware";
import {AuthorController} from "../controller/AuthorController";

export default async function authorRoutes() {
    app.post("/api/author/create", {
        preHandler: authenticationMiddleware,
        handler: AuthorController.instance.createAuthor,
    });
    app.post("/api/author/all/nationality", {
        preHandler: authenticationMiddleware,
        handler: AuthorController.instance.findAuthorsByNationality,
    });
    app.post("/api/author/all", {
        preHandler: authenticationMiddleware,
        handler: AuthorController.instance.findAllAuthors,
    });
}
