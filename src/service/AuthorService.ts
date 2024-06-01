import {ClientSession, ObjectId} from "mongodb";
import {CreateAuthorDto} from "../dto/author/CreateAuthorDto";
import {AuthorReplyDto} from "../dto/author/AuthorReplyDto";
import {AuthorRepository, IAuthorFilter} from "../repository/AuthorRepository";
import {AuthorModel} from "../model/AuthorModel";
import {ApiError} from "../error/ApiError";
import {ApiMessages} from "../util/ApiMessages";
import {ENationality} from "../interfaces";
import {FindAllAuthorDto} from "../dto/author/FindAllAuthorDto";
import {ReplaceAuthorDto} from "../dto/author/ReplaceAuthorDto";
import {RemoveAuthorDto} from "../dto/author/RemoveAuthorDto";

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

    async replaceAuthor(session: ClientSession, dto: ReplaceAuthorDto): Promise<AuthorReplyDto> {
        const authorRepo = AuthorRepository.instance;

        const foundAuthor = await authorRepo.findAuthorById(session, new ObjectId(dto.id));
        if (!foundAuthor) {
            throw new ApiError(ApiMessages.AUTHOR.AUTHOR_NOT_FOUND);
        }

        if (dto.name) {
            foundAuthor.name = dto.name;
        }

        if (dto.surname) {
            foundAuthor.surname = dto.surname;
        }

        if (dto.nationality) {
            const nationality = dto.nationality as ENationality;
            foundAuthor.nationality = nationality;
        }

        if (dto.biography) {
            foundAuthor.biography = dto.biography;
        }

        await authorRepo.replaceAuthor(session, foundAuthor);
        return foundAuthor.mapToDto();
    }

    async removeAuthor(session: ClientSession, dto: RemoveAuthorDto): Promise<AuthorReplyDto> {
        const authorRepo = AuthorRepository.instance;

        const foundAuthor = await authorRepo.findAuthorById(session, new ObjectId(dto.id));
        if (!foundAuthor) {
            throw new ApiError(ApiMessages.AUTHOR.AUTHOR_NOT_FOUND);
        }

        await authorRepo.removeAuthor(session, foundAuthor);
        return foundAuthor.mapToDto();
    }
}
