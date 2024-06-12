export function isString(input: unknown, message: string): void {
    if (typeof input !== "string") {
        throw new Error(message);
    }
}

export function isOptionalString(input: unknown, message: string): void {
    if (input) {
        isString(input, message);
    }
}

export function isNumber(input: unknown, message: string): void {
    const num = parseInt(String(input));

    if (isNaN(num)) {
        throw new Error(message);
    }
}

export function isOptionalNumber(input: unknown, message: string): void {
    if (input) {
        isNumber(input, message);
    }
}

export function isArray(input: unknown, message: string): void {
    if (!Array.isArray(input)) {
        throw new Error(message);
    }
}

export function isOptionalArray(input: unknown, message: string): void {
    if (input) {
        isArray(input, message);
    }
}

export function check(condition: unknown, message: string): asserts condition {
    if (!condition) {
        throw new Error(message);
    }
}
