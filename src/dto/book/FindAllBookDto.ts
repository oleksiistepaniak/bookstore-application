export interface FindAllBookDto {
    page?: number;
    limit?: number;
    title?: string;
    description?: string;
    minNumberOfPages?: number;
    maxNumberOfPages?: number;
}