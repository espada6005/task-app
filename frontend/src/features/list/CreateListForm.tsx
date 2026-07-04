import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { listSchema, type ListFormValues } from '../../schemas/listSchema'
import { useCreateList } from '../../hooks/useLists'

type Props = {
  boardId: number
}

export function CreateListForm({ boardId }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const createList = useCreateList(boardId)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ListFormValues>({
    resolver: zodResolver(listSchema),
  })

  const onSubmit = (values: ListFormValues) => {
    createList.mutate(values.title, {
      onSuccess: () => {
        reset()
        setIsOpen(false)
      },
    })
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="shrink-0 w-72 h-fit bg-white/60 hover:bg-white rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 hover:text-gray-700 transition-colors text-left"
      >
        + リストを追加
      </button>
    )
  }

  return (
    <div className="shrink-0 w-72 bg-gray-100 rounded-xl p-3 h-fit">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register('title')}
          placeholder="リストのタイトル"
          autoFocus
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsOpen(false)
              reset()
            }
          }}
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            disabled={createList.isPending}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            追加
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false)
              reset()
            }}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  )
}
