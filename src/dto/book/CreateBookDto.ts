export interface CreateBookDto {
    title: string;
    description: string;
    numberOfPages: number;
    category: string;
    authorsIds: string[];
}
