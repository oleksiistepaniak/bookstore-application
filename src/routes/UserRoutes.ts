import {AuthenticationController} from "../controllers/AuthenticationController";
import {app} from "../index";

export default async function authenticationRoutes() {
    app.post('/api/signup', AuthenticationController.instance.signup);
}
