export const Constants = {
    EMAIL_REGEXP: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD_REGEXP: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/,
    MIN_PASSWORD_LENGTH: 6,
    MAX_PASSWORD_LENGTH: 20,
    HEALTH_MESSAGE: "Everything is working!",
    USER: {
        E11000_MESSAGE: 'E11000',
        DUPLICATE_KEY_MESSAGE: 'duplicate key',
        MIN_NAME_LENGTH: 2,
        MAX_NAME_LENGTH: 30,
        MIN_AGE_VALUE: 6,
        MAX_AGE_VALUE: 130,
    }
}
