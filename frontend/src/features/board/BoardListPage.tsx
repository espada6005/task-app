import { useState } from 'react'
import { useBoards } from '../../hooks/useBoards'
import { BoardCard } from './BoardCard'
import { CreateBoardForm } from './CreateBoardForm'

export function BoardListPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { data: boards, isLoading, isError } = useBoards()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        読み込み中...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        データの取得に失敗しました
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">ボード一覧</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            + ボードを作成
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {boards && boards.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm mb-4">ボードがありません</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              最初のボードを作成
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {boards?.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        )}
      </main>

      {showCreateForm && (
        <CreateBoardForm onClose={() => setShowCreateForm(false)} />
      )}
    </div>
  )
}
