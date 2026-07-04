import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { selectedCardIdAtom } from '../../atoms/cardAtoms'
import { cardDetailSchema, type CardDetailFormValues } from '../../schemas/cardSchema'
import { useCard, useUpdateCard, useDeleteCard } from '../../hooks/useCards'

type Props = {
  boardId: number
}

export function CardModal({ boardId }: Props) {
  const [selectedCardId, setSelectedCardId] = useAtom(selectedCardIdAtom)
  const { data: card, isLoading } = useCard(selectedCardId)
  const updateCard = useUpdateCard(boardId)
  const deleteCard = useDeleteCard(boardId)

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<CardDetailFormValues>({
    resolver: zodResolver(cardDetailSchema),
  })

  useEffect(() => {
    if (card) {
      reset({
        title: card.title,
        description: card.description ?? '',
        dueDate: card.dueDate ?? '',
      })
    }
  }, [card, reset])

  if (selectedCardId === null) return null

  const handleClose = () => setSelectedCardId(null)

  const onSubmit = (values: CardDetailFormValues) => {
    updateCard.mutate({
      cardId: selectedCardId,
      data: {
        title: values.title,
        description: values.description ? values.description : null,
        dueDate: values.dueDate ? values.dueDate : null,
      },
    })
  }

  const handleDelete = () => {
    if (confirm('このカードを削除しますか？')) {
      deleteCard.mutate(selectedCardId, { onSuccess: handleClose })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={handleClose}>
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading || !card ? (
          <div className="text-center text-gray-400 py-8">読み込み中...</div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-start justify-between gap-2 mb-4">
              <input
                {...register('title')}
                className="flex-1 text-lg font-semibold text-gray-800 border border-transparent hover:border-gray-300 focus:border-blue-500 rounded-lg px-2 py-1 -mx-2 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none px-1"
              >
                ×
              </button>
            </div>
            {errors.title && <p className="text-red-500 text-xs -mt-3 mb-3">{errors.title.message}</p>}

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 mb-1">説明</label>
              <textarea
                {...register('description')}
                rows={5}
                placeholder="詳細を入力..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-500 mb-1">期限日</label>
              <input
                type="date"
                {...register('dueDate')}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteCard.isPending}
                className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
              >
                カードを削除
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                >
                  閉じる
                </button>
                <button
                  type="submit"
                  disabled={!isDirty || updateCard.isPending}
                  className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  保存
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
