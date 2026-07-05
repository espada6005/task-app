import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { boardsApi } from '../api/boards';

export const boardKeys = {
    all: ['boards'] as const,
    detail: (id: number) => ['boards', id] as const,
};

export function useBoards() {
    return useQuery({
        queryKey: boardKeys.all,
        queryFn: boardsApi.getAll,
    });
}

export function useBoardDetail(boardId: number) {
    return useQuery({
        queryKey: boardKeys.detail(boardId),
        queryFn: () => boardsApi.getDetail(boardId),
    });
}

export function useCreateBoard() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (title: string) => boardsApi.create(title),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: boardKeys.all });
        },
    });
}

export function useUpdateBoard() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ boardId, title }: { boardId: number; title: string }) =>
            boardsApi.update(boardId, title),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: boardKeys.all });
        },
    });
}

export function useDeleteBoard() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (boardId: number) => boardsApi.delete(boardId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: boardKeys.all });
        },
    });
}
