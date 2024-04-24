import {app} from "../index";

export class AppConf {
    private readonly DB_URL: string;
    private readonly JWT_SECRET: string;
    private readonly JWT_EXPIRE: string;
    private readonly SALT: number;

    constructor() {
        this.DB_URL = String(process.env.DB_URL);
        this.JWT_SECRET = String(process.env.JWT_SECRET);
        this.JWT_EXPIRE = String(process.env.JWT_EXPIRE);
        this.SALT = parseInt(String(process.env.SALT));
        app.log.info(`DB_URL: ${this.DB_URL}`);
        app.log.info(`JWT_SECRET: ${this.JWT_SECRET}`);
        app.log.info(`JWT_EXPIRE: ${this.JWT_EXPIRE}`);
        app.log.info(`SALT: ${this.SALT}`);
    }

    get db_url(): string {
        return this.DB_URL;
    }

    get jwt_secret(): string {
        return this.JWT_SECRET;
    }

    get jwt_expire(): string {
        return this.JWT_EXPIRE;
    }

    get salt(): number {
        return this.SALT;
    }
}
