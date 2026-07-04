import { useSetAtom } from 'jotai'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { selectedCardIdAtom } from '../../atoms/cardAtoms'
import { cardSortableId } from '../board/dndIds'
import type { CardSummary } from '../../api/boards'

type Props = {
  card: CardSummary
  listId: number
}

function isOverdue(dueDate: string | null) {
  if (!dueDate) return false
  return new Date(dueDate) < new Date(new Date().toDateString())
}

type ContentProps = {
  card: CardSummary
  onClick?: () => void
}

export function CardContent({ card, onClick }: ContentProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all"
    >
      <p className="text-sm text-gray-800 break-words">{card.title}</p>
      {card.dueDate && (
        <p
          className={`text-xs mt-2 inline-block px-1.5 py-0.5 rounded ${
            isOverdue(card.dueDate) ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {new Date(card.dueDate).toLocaleDateString('ja-JP')}
        </p>
      )}
    </div>
  )
}

export function CardItem({ card, listId }: Props) {
  const setSelectedCardId = useSetAtom(selectedCardIdAtom)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: cardSortableId(card.id),
    data: { type: 'card', cardId: card.id, listId },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CardContent card={card} onClick={() => setSelectedCardId(card.id)} />
    </div>
  )
}
