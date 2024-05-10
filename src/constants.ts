import {ClientSession} from "mongodb";

export const Constants = {
    EMAIL_REGEXP: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD_REGEXP: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/,
    LATIN_ONLY_REGEXP: /^[a-zA-Z]+$/,
    LATIN_WITH_ONLY_SYMBOLS_REGEXP: /^[a-zA-Z\s.,'’()-?!]+$/,
    MIN_PASSWORD_LENGTH: 6,
    MAX_PASSWORD_LENGTH: 20,
    NO_SESSION: null as unknown as ClientSession,
    HEALTH_MESSAGE: "Everything is working!",
    USER: {
        E11000_MESSAGE: "E11000",
        DUPLICATE_KEY_MESSAGE: "duplicate key",
        MIN_NAME_LENGTH: 2,
        MAX_NAME_LENGTH: 30,
        MIN_AGE_VALUE: 6,
        MAX_AGE_VALUE: 130,
    },
    AUTHOR: {
        MIN_NAME_LENGTH: 2,
        MAX_NAME_LENGTH: 30,
        MIN_BIOGRAPHY_LENGTH: 100,
        MAX_BIOGRAPHY_LENGTH: 2000,
        MIN_SURNAME_LENGTH: 2,
        MAX_SURNAME_LENGTH: 40,
    },
    BOOK: {
        MIN_TITLE_LENGTH: 4,
        MAX_TITLE_LENGTH: 255,
        MIN_DESCRIPTION_LENGTH: 20,
        MAX_DESCRIPTION_LENGTH: 510,
        MAX_NUMBER_OF_PAGES: 5000,
        MIN_NUMBER_OF_PAGES: 30,
    },
}
