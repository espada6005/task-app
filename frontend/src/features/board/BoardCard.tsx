import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { boardSchema, type BoardFormValues } from '../../schemas/boardSchema'
import { useUpdateBoard, useDeleteBoard } from '../../hooks/useBoards'
import type { BoardResponse } from '../../api/boards'

type Props = {
  board: BoardResponse
}

export function BoardCard({ board }: Props) {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const updateBoard = useUpdateBoard()
  const deleteBoard = useDeleteBoard()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BoardFormValues>({
    resolver: zodResolver(boardSchema),
    defaultValues: { title: board.title },
  })

  const onSubmit = (values: BoardFormValues) => {
    updateBoard.mutate(
      { boardId: board.id, title: values.title },
      { onSuccess: () => setIsEditing(false) }
    )
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm(`「${board.title}」を削除しますか？`)) {
      deleteBoard.mutate(board.id)
    }
  }

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register('title')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
          <div className="flex gap-2 mt-3">
            <button
              type="submit"
              disabled={updateBoard.isPending}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              保存
            </button>
            <button
              type="button"
              onClick={() => { setIsEditing(false); reset() }}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div
      onClick={() => navigate(`/boards/${board.id}`)}
      className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all group"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-semibold text-gray-800 text-sm leading-snug break-words">
          {board.title}
        </h2>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); setIsEditing(true) }}
            className="p-1 text-gray-400 hover:text-blue-600 rounded"
            title="編集"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteBoard.isPending}
            className="p-1 text-gray-400 hover:text-red-600 rounded disabled:opacity-50"
            title="削除"
          >
            🗑️
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        {new Date(board.createdAt).toLocaleDateString('ja-JP')}
      </p>
    </div>
  )
}
