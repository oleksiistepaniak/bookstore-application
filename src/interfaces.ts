import {FastifyRequest} from "fastify";

export type TUserRequest = FastifyRequest & {
    user?: { id: string };
}

export enum EBookCategory {
    "Fiction",
    "Non",
    "Mystery",
    "Science Fiction",
    "Romance",
    "Historical Fiction",
    "Biography",
    "Self-help",
    "Business",
    "Travel",
}

export enum ENationality {
    "Austrian",
    "Belgian",
    "British",
    "Croatian",
    "Czech",
    "Danish",
    "Dutch",
    "Estonian",
    "Finnish",
    "French",
    "German",
    "Greek",
    "Hungarian",
    "Irish",
    "Italian",
    "Latvian",
    "Lithuanian",
    "Maltese",
    "Polish",
    "Portuguese",
    "Romanian",
    "Slovak",
    "Slovenian",
    "Spanish",
    "Swedish",
    "Ukrainian",
}