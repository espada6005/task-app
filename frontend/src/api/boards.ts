import apiClient from './client';

export type BoardResponse = {
    id: number;
    title: string;
    createdAt: string;
    updatedAt: string;
};

export type CardSummary = {
    id: number;
    title: string;
    description: string | null;
    position: number;
    dueDate: string | null;
};

export type ListWithCards = {
    id: number;
    title: string;
    position: number;
    cards: CardSummary[];
};

export type BoardDetailResponse = BoardResponse & {
    lists: ListWithCards[];
};

export const boardsApi = {
    getAll: () =>
        apiClient.get<BoardResponse[]>('/boards').then((r) => r.data),

    getDetail: (boardId: number) =>
        apiClient.get<BoardDetailResponse>(`/boards/${boardId}`).then((r) => r.data),

    create: (title: string) =>
        apiClient.post<BoardResponse>('/boards', { title }).then((r) => r.data),

    update: (boardId: number, title: string) =>
        apiClient.patch<BoardResponse>(`/boards/${boardId}`, { title }).then((r) => r.data),

    delete: (boardId: number) =>
        apiClient.delete(`/boards/${boardId}`),
};
