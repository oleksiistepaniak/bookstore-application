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
        CANNOT_CREATE_USER: "cannot_create_user",
    },
    AUTHOR: {
        NAME_NOT_STRING: "name_not_string",
        SURNAME_NOT_STRING: "surname_not_string",
        NATIONALITY_NOT_STRING: "nationality_not_string",
        BIOGRAPHY_NOT_STRING: "biography_not_string",
        INVALID_NAME_LENGTH: "invalid_name_length",
        INVALID_SURNAME_LENGTH: "invalid_surname_length",
        INVALID_BIOGRAPHY_LENGTH: "invalid_biography_length",
        ONLY_LATIN_CHARS_FOR_NAME: "only_latin_chars_for_name",
        ONLY_LATIN_CHARS_FOR_SURNAME: "only_latin_chars_for_surname",
        ONLY_LATIN_CHARS_FOR_BIOGRAPHY: "only_latin_chars_for_biography",
        INVALID_NATIONALITY: "invalid_nationality",
        CANNOT_CREATE_AUTHOR: "cannot_create_author",
    },
    BOOK: {
        TITLE_NOT_STRING: "title_not_string",
        DESCRIPTION_NOT_STRING: "description_not_string",
        CATEGORY_NOT_STRING: "category_not_string",
        NUMBER_OF_PAGES_NOT_NUMBER: "number_of_pages_not_number",
        AUTHOR_ID_NOT_STRING: "author_id_not_string",
        INVALID_TITLE_LENGTH: "invalid_title_length",
        INVALID_DESCRIPTION_LENGTH: "invalid_description_length",
        INVALID_NUMBER_OF_PAGES: "invalid_number_of_pages",
        INVALID_CATEGORY: "invalid_category",
        INVALID_AUTHORS_IDS_ARRAY: "invalid_authors_ids",
        INVALID_AUTHOR_ID: "invalid_author_id",
        ONLY_LATIN_CHARS_FOR_TITLE: "only_latin_chars_for_title",
        ONLY_LATIN_CHARS_FOR_DESCRIPTION: "only_latin_chars_for_description",
        AUTHOR_NOT_FOUND: "author_not_found",
        CANNOT_CREATE_BOOK: "cannot_create_book",
        PAGE_NOT_NUMBER: "page_not_number",
        LIMIT_NOT_NUMBER: "limit_not_number",
        MAX_NUMBER_OF_PAGES_NOT_NUMBER: "max_number_of_pages_not_number",
        MIN_NUMBER_OF_PAGES_NOT_NUMBER: "min_number_of_pages_not_number",
    },
    AUTH_MIDDLEWARE: {
        TOKEN_NOT_PROVIDED: "token_not_provided",
        INVALID_TOKEN: "invalid_token",
    }
}
