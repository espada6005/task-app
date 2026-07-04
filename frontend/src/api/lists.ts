import apiClient from './client'

export type TaskListResponse = {
  id: number
  boardId: number
  title: string
  position: number
  createdAt: string
  updatedAt: string
}

export type ListOrderItem = {
  id: number
  position: number
}

export const listsApi = {
  create: (boardId: number, title: string) =>
    apiClient.post<TaskListResponse>(`/boards/${boardId}/lists`, { title }).then((r) => r.data),

  update: (listId: number, title: string) =>
    apiClient.patch<TaskListResponse>(`/lists/${listId}`, { title }).then((r) => r.data),

  delete: (listId: number) =>
    apiClient.delete(`/lists/${listId}`),

  reorder: (boardId: number, lists: ListOrderItem[]) =>
    apiClient.patch('/lists/reorder', { boardId, lists }),
}
