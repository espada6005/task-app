import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSortable } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { listSchema, type ListFormValues } from '../../schemas/listSchema'
import { useUpdateList, useDeleteList } from '../../hooks/useLists'
import { CardItem } from '../card/CardItem'
import { CreateCardForm } from '../card/CreateCardForm'
import { listSortableId, cardSortableId, emptyDroppableId } from '../board/dndIds'
import type { ListWithCards } from '../../api/boards'

type Props = {
  boardId: number
  list: ListWithCards
}

export function ListColumn({ boardId, list }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const updateList = useUpdateList(boardId)
  const deleteList = useDeleteList(boardId)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: listSortableId(list.id),
    data: { type: 'list', listId: list.id },
  })

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: emptyDroppableId(list.id),
    data: { type: 'list', listId: list.id },
  })

  const { register, handleSubmit, formState: { errors } } = useForm<ListFormValues>({
    resolver: zodResolver(listSchema),
    defaultValues: { title: list.title },
  })

  const onSubmit = (values: ListFormValues) => {
    updateList.mutate(
      { listId: list.id, title: values.title },
      { onSuccess: () => setIsEditing(false) }
    )
  }

  const handleDelete = () => {
    if (confirm(`「${list.title}」を削除しますか？（中のカードも削除されます）`)) {
      deleteList.mutate(list.id)
    }
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const sortedCards = [...list.cards].sort((a, b) => a.position - b.position)

  return (
    <div ref={setNodeRef} style={style} className="shrink-0 w-72 bg-gray-100 rounded-xl p-3 h-fit">
      <div {...attributes} {...listeners} className="flex items-center justify-between mb-2 cursor-grab active:cursor-grabbing">
        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1" onClick={(e) => e.stopPropagation()}>
            <input
              {...register('title')}
              autoFocus
              onBlur={handleSubmit(onSubmit)}
              className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </form>
        ) : (
          <h3
            onClick={() => setIsEditing(true)}
            className="font-semibold text-gray-700 text-sm px-1 py-1 flex-1 truncate"
          >
            {list.title}
          </h3>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleDelete()
          }}
          disabled={deleteList.isPending}
          className="p-1 text-gray-400 hover:text-red-600 rounded shrink-0 disabled:opacity-50"
          title="リストを削除"
        >
          🗑️
        </button>
      </div>

      <div ref={setDroppableRef} className="flex flex-col gap-2 min-h-[8px]">
        <SortableContext items={sortedCards.map((c) => cardSortableId(c.id))} strategy={verticalListSortingStrategy}>
          {sortedCards.map((card) => (
            <CardItem key={card.id} card={card} listId={list.id} />
          ))}
        </SortableContext>
      </div>

      <div className="mt-2">
        <CreateCardForm boardId={boardId} listId={list.id} />
      </div>
    </div>
  )
}
