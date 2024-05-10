import {app} from "../index";
import {AuthenticationController} from "../controller/AuthenticationController";

export default async function authenticationRoutes() {
    app.post("/api/signup", AuthenticationController.instance.signup);
    app.post("/api/signin", AuthenticationController.instance.signin);
}
