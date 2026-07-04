import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { boardSchema, type BoardFormValues } from '../../schemas/boardSchema'
import { useCreateBoard } from '../../hooks/useBoards'
import { Modal } from '../../components/Modal'

type Props = {
  onClose: () => void
}

export function CreateBoardForm({ onClose }: Props) {
  const createBoard = useCreateBoard()

  const { register, handleSubmit, formState: { errors } } = useForm<BoardFormValues>({
    resolver: zodResolver(boardSchema),
  })

  const onSubmit = (values: BoardFormValues) => {
    createBoard.mutate(values.title, {
      onSuccess: onClose,
    })
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="text-base font-semibold text-gray-800 mb-4">ボードを作成</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register('title')}
          placeholder="ボードのタイトル"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
        )}
        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            disabled={createBoard.isPending}
            className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {createBoard.isPending ? '作成中...' : '作成'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50"
          >
            キャンセル
          </button>
        </div>
      </form>
    </Modal>
  )
}
