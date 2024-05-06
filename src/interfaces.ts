import {FastifyRequest} from "fastify";

export type TUserRequest = FastifyRequest & {
    user?: { id: string };
}

export type TBookCategory =
    "Fiction" |
    "Non" |
    "Mystery" |
    "Science Fiction" |
    "Romance" |
    "Historical Fiction" |
    "Biography" |
    "Self-help" |
    "Business" |
    "Travel";