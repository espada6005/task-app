import apiClient from './client'

export type CardResponse = {
    id: number
    listId: number
    title: string
    description: string | null
    position: number
    dueDate: string | null
    createdAt: string
    updatedAt: string
}

export type CardOrderItem = {
    id: number
    listId: number
    position: number
}

export type UpdateCardRequest = {
    title?: string
    description?: string | null
    dueDate?: string | null
}

export type CardSearchParams = {
    title?: string
    dueDateBefore?: string
    overdue?: boolean
}

export type CardSearchResult = {
    id: number
    listId: number
    listTitle: string
    title: string
    description: string | null
    position: number
    dueDate: string | null
}

export const cardsApi = {
    get: (cardId: number) =>
        apiClient.get<CardResponse>(`/cards/${cardId}`).then((r) => r.data),

    create: (listId: number, title: string) =>
        apiClient.post<CardResponse>(`/lists/${listId}/cards`, { title }).then((r) => r.data),

    update: (cardId: number, data: UpdateCardRequest) =>
        apiClient.patch<CardResponse>(`/cards/${cardId}`, data).then((r) => r.data),

    delete: (cardId: number) =>
        apiClient.delete(`/cards/${cardId}`),

    reorder: (cards: CardOrderItem[]) =>
        apiClient.patch('/cards/reorder', { cards }),

    search: (boardId: number, params: CardSearchParams) =>
        apiClient
            .get<CardSearchResult[]>(`/boards/${boardId}/cards/search`, { params })
            .then((r) => r.data),
}
