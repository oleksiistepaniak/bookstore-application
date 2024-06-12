export interface BookReplyDto {
    id: string;
    title: string;
    description: string;
    numberOfPages: number;
    category: string;
    authorsIds: string[];
    userCreatorId: string;
}
