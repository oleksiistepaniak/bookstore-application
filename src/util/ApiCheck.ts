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

export function check(condition: boolean, message: string): void {
    if (!condition) {
        throw new Error(message);
    }
}
