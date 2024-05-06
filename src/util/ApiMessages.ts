export const ApiMessages = {
    MONGO_CONNECTION_FAILED: "mongo_connection_failed",
    USER: {
        EMAIL_NOT_STRING: "email_not_string",
        PASSWORD_NOT_STRING: "password_not_string",
        FIRSTNAME_NOT_STRING: "firstname_not_string",
        LASTNAME_NOT_STRING: "lastname_not_string",
        AGE_NOT_NUMBER: "age_not_number",
        INVALID_PASSWORD: "invalid_password",
        INVALID_EMAIL: "invalid_email",
        INVALID_FIRSTNAME: "invalid_firstname",
        INVALID_LASTNAME: "invalid_lastname",
        INVALID_AGE: "invalid_age",
        USER_EXISTS: "user_exists",
        INVALID_PASSWORD_OR_EMAIL: "invalid_password_or_email",
    },
    AUTH_MIDDLEWARE: {
        TOKEN_NOT_PROVIDED: "token_not_provided",
        INVALID_TOKEN: "invalid_token",
    }
}
