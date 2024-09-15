interface EnvironmentVariables {
    //Application
    APP_HOST: string;
    APP_PORT: number;

    //Database
    DB_HOST: string;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB_SYNC: boolean;
    DB_LOGGING: boolean;

    //CORS whitelist
    ALLOW_LIST: string[];
}
