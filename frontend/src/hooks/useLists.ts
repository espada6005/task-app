import { useMutation, useQueryClient } from '@tanstack/react-query'
import { listsApi, type ListOrderItem } from '../api/lists'
import { boardKeys } from './useBoards'
import type { BoardDetailResponse } from '../api/boards'

export function useCreateList(boardId: number) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (title: string) => listsApi.create(boardId, title),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: boardKeys.detail(boardId) })
        },
    })
}

export function useUpdateList(boardId: number) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ listId, title }: { listId: number; title: string }) =>
            listsApi.update(listId, title),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: boardKeys.detail(boardId) })
        },
    })
}

export function useDeleteList(boardId: number) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (listId: number) => listsApi.delete(listId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: boardKeys.detail(boardId) })
        },
    })
}

export function useReorderLists(boardId: number) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (lists: ListOrderItem[]) => listsApi.reorder(boardId, lists),
        onMutate: async (lists) => {
            await queryClient.cancelQueries({ queryKey: boardKeys.detail(boardId) })
            const previous = queryClient.getQueryData<BoardDetailResponse>(boardKeys.detail(boardId))
            if (previous) {
                const positionById = new Map(lists.map((l) => [l.id, l.position]))
                const updated: BoardDetailResponse = {
                    ...previous,
                    lists: [...previous.lists]
                        .map((l) => ({ ...l, position: positionById.get(l.id) ?? l.position }))
                        .sort((a, b) => a.position - b.position),
                }
                queryClient.setQueryData(boardKeys.detail(boardId), updated)
            }
            return { previous }
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(boardKeys.detail(boardId), context.previous)
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: boardKeys.detail(boardId) })
        },
    })
}
