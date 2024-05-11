import {ClientSession} from "mongodb";
import {CreateAuthorDto} from "../dto/author/CreateAuthorDto";
import {AuthorReplyDto} from "../dto/author/AuthorReplyDto";
import {AuthorRepository, IAuthorFilter} from "../repository/AuthorRepository";
import {AuthorModel} from "../model/AuthorModel";
import {ApiError} from "../error/ApiError";
import {ApiMessages} from "../util/ApiMessages";
import {ENationality} from "../interfaces";
import {FindAllAuthorDto} from "../dto/author/FindAllAuthorDto";

export class AuthorService {
    private static _instance: AuthorService;

    private constructor() {
    }

    public static get instance(): AuthorService {
        if (!this._instance) {
            this._instance = new AuthorService();
        }

        return this._instance;
    }

    async createAuthor(session: ClientSession, dto: CreateAuthorDto): Promise<AuthorReplyDto> {
        const authorRepo = AuthorRepository.instance;

        const authorModel = AuthorModel.create(dto);
        try {
            await authorRepo.createAuthor(session, authorModel);
        } catch (error) {
            throw new ApiError(ApiMessages.AUTHOR.CANNOT_CREATE_AUTHOR);
        }
        return authorModel.mapToDto();
    }

    async findAllAuthors(session: ClientSession, dto: FindAllAuthorDto): Promise<AuthorReplyDto[]> {
        const authorRepo = AuthorRepository.instance;

        const filter: IAuthorFilter = {
            page: dto.page,
            limit: dto.limit,
            name: dto.name,
            surname: dto.surname,
            biography: dto.biography,
            nationality: dto.nationality ? dto.nationality as ENationality : undefined,
        };

        const authors = await authorRepo.findAllAuthors(session, filter);
        return authors.map(it => it.mapToDto());
    }
}
