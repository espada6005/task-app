import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cardsApi, type CardOrderItem, type CardSearchParams, type UpdateCardRequest } from '../api/cards';
import { boardKeys } from './useBoards';
import type { BoardDetailResponse, CardSummary } from '../api/boards';

export const cardKeys = {
    detail: (id: number) => ['cards', id] as const,
    search: (boardId: number, params: CardSearchParams) => ['boards', boardId, 'cards', 'search', params] as const,
};

export function useSearchCards(boardId: number, params: CardSearchParams, enabled: boolean) {
    return useQuery({
        queryKey: cardKeys.search(boardId, params),
        queryFn: () => cardsApi.search(boardId, params),
        enabled,
    });
}

export function useCard(cardId: number | null) {
    return useQuery({
        queryKey: cardKeys.detail(cardId ?? 0),
        queryFn: () => cardsApi.get(cardId!),
        enabled: cardId !== null,
    });
}

export function useCreateCard(boardId: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ listId, title }: { listId: number; title: string }) =>
            cardsApi.create(listId, title),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: boardKeys.detail(boardId) });
        },
    });
}

export function useUpdateCard(boardId: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ cardId, data }: { cardId: number; data: UpdateCardRequest }) =>
            cardsApi.update(cardId, data),
        onSuccess: (updated) => {
            queryClient.invalidateQueries({ queryKey: boardKeys.detail(boardId) });
            queryClient.invalidateQueries({ queryKey: cardKeys.detail(updated.id) });
        },
    });
}

export function useDeleteCard(boardId: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (cardId: number) => cardsApi.delete(cardId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: boardKeys.detail(boardId) });
        },
    });
}

export function useReorderCards(boardId: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (cards: CardOrderItem[]) => cardsApi.reorder(cards),
        onMutate: async (cards) => {
            await queryClient.cancelQueries({ queryKey: boardKeys.detail(boardId) });
            const previous = queryClient.getQueryData<BoardDetailResponse>(boardKeys.detail(boardId));
            if (previous) {
                const cardById = new Map<number, CardSummary>();
                previous.lists.forEach((l) => l.cards.forEach((c) => cardById.set(c.id, c)));

                const affectedListIds = new Set(cards.map((c) => c.listId));
                const updated: BoardDetailResponse = {
                    ...previous,
                    lists: previous.lists.map((l) => {
                        if (!affectedListIds.has(l.id)) return l;
                        const newCards = cards
                            .filter((c) => c.listId === l.id)
                            .map((item) => {
                                const base = cardById.get(item.id);
                                return base ? { ...base, position: item.position } : null;
                            })
                            .filter((c): c is CardSummary => c !== null)
                            .sort((a, b) => a.position - b.position);
                        return { ...l, cards: newCards };
                    }),
                };
                queryClient.setQueryData(boardKeys.detail(boardId), updated);
            }
            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(boardKeys.detail(boardId), context.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: boardKeys.detail(boardId) });
        },
    });
}
