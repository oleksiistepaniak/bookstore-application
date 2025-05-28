import {app} from "../index";

export class AppConf {
    private static _instance: AppConf;
    private readonly _DB_URL: string;
    private readonly _JWT_SECRET: string;
    private readonly _JWT_EXPIRE: string;
    private readonly _APP_PORT: number;
    private readonly _SALT: number;

    private constructor() {
        this._DB_URL = String(process.env.DB_URL);
        this._JWT_SECRET = String(process.env.JWT_SECRET);
        this._JWT_EXPIRE = String(process.env.JWT_EXPIRE);
        this._SALT = parseInt(String(process.env.SALT));
        this._APP_PORT = parseInt(String(process.env.APP_PORT));
        app.log.info(`DB_URL: ${this._DB_URL}`);
        app.log.info(`JWT_SECRET: ${this._JWT_SECRET}`);
        app.log.info(`JWT_EXPIRE: ${this._JWT_EXPIRE}`);
        app.log.info(`SALT: ${this._SALT}`);
        app.log.info(`APP_PORT: ${this._APP_PORT}`);
    }

    // TODO: all singletons as a replacer of DI should be altered using other solution
    public static get instance(): AppConf {
        if (!this._instance) {
            this._instance = new AppConf();
        }
        return this._instance;
    }

    get DB_URL(): string {
        return this._DB_URL;
    }

    get JWT_SECRET(): string {
        return this._JWT_SECRET;
    }

    get JWT_EXPIRE(): string {
        return this._JWT_EXPIRE;
    }

    get SALT(): number {
        return this._SALT;
    }

    get APP_PORT(): number {
        return this._APP_PORT;
    }
}

