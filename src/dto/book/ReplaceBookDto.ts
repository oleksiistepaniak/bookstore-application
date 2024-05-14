export interface ReplaceBookDto {
    id: string;
    title?: string;
    description?: string;
    numberOfPages?: number;
    category?: string;
    authorsIds?: string[];
}