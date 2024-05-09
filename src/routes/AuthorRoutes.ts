import {app} from "../index";
import {AuthorController} from "../controllers/AuthorController";
import {authenticationMiddleware} from "../middleware/AuthenticationMiddleware";

export default async function authorRoutes() {
    app.post("/api/author/create",{
        preHandler: authenticationMiddleware,
        handler: AuthorController.instance.createAuthor,
    });
}
