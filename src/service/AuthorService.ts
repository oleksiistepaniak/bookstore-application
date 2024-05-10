import {ClientSession} from "mongodb";
import {CreateAuthorDto} from "../dto/author/CreateAuthorDto";
import {AuthorReplyDto} from "../dto/author/AuthorReplyDto";
import {AuthorRepository} from "../repository/AuthorRepository";
import {AuthorModel} from "../model/AuthorModel";
import {ApiError} from "../error/ApiError";
import {ApiMessages} from "../util/ApiMessages";
import {NationalityDto} from "../dto/author/NationalityDto";
import {ENationality} from "../interfaces";

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

    async findAuthorsByNationality(session: ClientSession, dto: NationalityDto): Promise<AuthorReplyDto[]> {
        const authorRepo = AuthorRepository.instance;
        const nationality = dto.nationality as unknown as ENationality;

        const authors = await authorRepo.findAuthorsByNationality(session, nationality);
        return authors.map(it => it.mapToDto());
    }

    async findAllAuthors(session: ClientSession): Promise<AuthorReplyDto[]> {
        const authorRepo = AuthorRepository.instance;

        const authors = await authorRepo.findAllAuthors(session);
        return authors.map(it => it.mapToDto());
    }
}
