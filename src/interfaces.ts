import {FastifyRequest} from "fastify";

export type TUserRequest = FastifyRequest & {
    user?: { id: string };
}

export enum EBookCategory {
    FICTION = "Fiction",
    NON = "Non",
    MYSTERY = "Mystery",
    SCIENCE_FICTION = "Science Fiction",
    ROMANCE = "Romance",
    HISTORICAL_FICTION = "Historical Fiction",
    BIOGRAPHY = "Biography",
    SELF_HELP = "Self-help",
    BUSINESS = "Business",
    TRAVEL = "Travel",
}

export enum ENationality {
    AUSTRIAN = "Austrian",
    BELGIAN = "Belgian",
    BRITISH = "British",
    CROATIAN = "Croatian",
    CZECH = "Czech",
    DANISH = "Danish",
    DUTCH = "Dutch",
    ESTONIAN = "Estonian",
    FINNISH = "Finnish",
    FRENCH = "French",
    GERMAN = "German",
    GREEK = "Greek",
    HUNGARIAN = "Hungarian",
    IRISH = "Irish",
    ITALIAN = "Italian",
    LATVIAN = "Latvian",
    LITHUANIAN = "Lithuanian",
    MALTESE = "Maltese",
    POLISH = "Polish",
    PORTUGUESE = "Portuguese",
    ROMANIAN = "Romanian",
    SLOVAK = "Slovak",
    SLOVENIAN = "Slovenian",
    SPANISH = "Spanish",
    SWEDISH = "Swedish",
    UKRAINIAN = "Ukrainian",
}