import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useBoardDetail } from '../../hooks/useBoards'
import { useReorderLists } from '../../hooks/useLists'
import { useReorderCards } from '../../hooks/useCards'
import { ListColumn } from '../list/ListColumn'
import { CreateListForm } from '../list/CreateListForm'
import { CardContent } from '../card/CardItem'
import { CardSearchBar } from '../card/CardSearchBar'
import { CardModal } from '../card/CardModal'
import { listSortableId } from './dndIds'
import type { BoardDetailResponse, CardSummary, ListWithCards } from '../../api/boards'
import type { CardOrderItem } from '../../api/cards'

function sortBoard(board: BoardDetailResponse): ListWithCards[] {
  return [...board.lists]
    .sort((a, b) => a.position - b.position)
    .map((l) => ({ ...l, cards: [...l.cards].sort((a, b) => a.position - b.position) }))
}

export function BoardDetailPage() {
  const { boardId } = useParams<{ boardId: string }>()
  const id = Number(boardId)
  const { data: board, isLoading, isError } = useBoardDetail(id)
  const reorderLists = useReorderLists(id)
  const reorderCards = useReorderCards(id)

  const [localLists, setLocalLists] = useState<ListWithCards[]>([])
  const [activeCard, setActiveCard] = useState<CardSummary | null>(null)
  const dragStartListIdRef = useRef<number | null>(null)
  const isDraggingRef = useRef(false)

  useEffect(() => {
    if (board && !isDraggingRef.current) {
      setLocalLists(sortBoard(board))
    }
  }, [board])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">読み込み中...</div>
    )
  }

  if (isError || !board) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        データの取得に失敗しました
      </div>
    )
  }

  function handleDragStart(event: DragStartEvent) {
    isDraggingRef.current = true
    const { active } = event
    if (active.data.current?.type === 'card') {
      const listId = active.data.current.listId as number
      const cardId = active.data.current.cardId as number
      dragStartListIdRef.current = listId
      const list = localLists.find((l) => l.id === listId)
      const card = list?.cards.find((c) => c.id === cardId)
      setActiveCard(card ?? null)
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return
    if (active.data.current?.type !== 'card') return

    const activeListId = active.data.current.listId as number
    const activeCardId = active.data.current.cardId as number

    let overListId: number | undefined
    if (over.data.current?.type === 'card') {
      overListId = over.data.current.listId as number
    } else if (over.data.current?.type === 'list') {
      overListId = over.data.current.listId as number
    }
    if (overListId === undefined || overListId === activeListId) return

    setLocalLists((prev) => {
      const activeList = prev.find((l) => l.id === activeListId)
      const overList = prev.find((l) => l.id === overListId)
      if (!activeList || !overList) return prev
      const activeCard = activeList.cards.find((c) => c.id === activeCardId)
      if (!activeCard) return prev

      const overIndex =
        over.data.current?.type === 'card'
          ? overList.cards.findIndex((c) => c.id === (over.data.current!.cardId as number))
          : overList.cards.length

      return prev.map((l) => {
        if (l.id === activeListId) {
          return { ...l, cards: l.cards.filter((c) => c.id !== activeCardId) }
        }
        if (l.id === overListId) {
          const newCards = [...l.cards]
          newCards.splice(overIndex, 0, activeCard)
          return { ...l, cards: newCards }
        }
        return l
      })
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    isDraggingRef.current = false
    setActiveCard(null)
    const { active, over } = event
    if (!over) return

    if (active.data.current?.type === 'list') {
      if (active.id === over.id) return
      const oldIndex = localLists.findIndex((l) => listSortableId(l.id) === active.id)
      const newIndex = localLists.findIndex((l) => listSortableId(l.id) === over.id)
      if (oldIndex === -1 || newIndex === -1) return
      const newOrder = arrayMove(localLists, oldIndex, newIndex)
      setLocalLists(newOrder)
      reorderLists.mutate(newOrder.map((l, i) => ({ id: l.id, position: i })))
      return
    }

    if (active.data.current?.type === 'card') {
      const activeCardId = active.data.current.cardId as number
      const finalListId = active.data.current.listId as number
      const originalListId = dragStartListIdRef.current
      dragStartListIdRef.current = null

      const listIdx = localLists.findIndex((l) => l.id === finalListId)
      if (listIdx === -1) return
      const list = localLists[listIdx]
      const activeIndex = list.cards.findIndex((c) => c.id === activeCardId)
      if (activeIndex === -1) return

      let reorderedCards = list.cards
      if (over.data.current?.type === 'card' && over.data.current.listId === finalListId) {
        const overIndex = list.cards.findIndex((c) => c.id === (over.data.current!.cardId as number))
        if (overIndex !== -1 && overIndex !== activeIndex) {
          reorderedCards = arrayMove(list.cards, activeIndex, overIndex)
        }
      }

      const newLists = [...localLists]
      newLists[listIdx] = { ...list, cards: reorderedCards }
      setLocalLists(newLists)

      const orderItems: CardOrderItem[] = reorderedCards.map((c, i) => ({
        id: c.id,
        listId: finalListId,
        position: i,
      }))

      if (originalListId !== null && originalListId !== finalListId) {
        const originalList = localLists.find((l) => l.id === originalListId)
        if (originalList) {
          originalList.cards.forEach((c, i) => {
            orderItems.push({ id: c.id, listId: originalListId, position: i })
          })
        }
      }

      reorderCards.mutate(orderItems)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4 mb-3">
          <Link to="/boards" className="text-gray-400 hover:text-gray-600 text-sm">
            ← ボード一覧
          </Link>
          <h1 className="text-xl font-bold text-gray-800">{board.title}</h1>
        </div>
        <CardSearchBar boardId={id} />
      </header>

      <main className="flex-1 overflow-x-auto px-6 py-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={localLists.map((l) => listSortableId(l.id))} strategy={horizontalListSortingStrategy}>
            <div className="flex items-start gap-4">
              {localLists.map((list) => (
                <ListColumn key={list.id} boardId={id} list={list} />
              ))}
              <CreateListForm boardId={id} />
            </div>
          </SortableContext>

          <DragOverlay>
            {activeCard ? (
              <div className="w-72">
                <CardContent card={activeCard} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      <CardModal boardId={id} />
    </div>
  )
}
