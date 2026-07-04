import { Routes, Route, Navigate } from 'react-router-dom'
import { BoardListPage } from './features/board/BoardListPage'
import { BoardDetailPage } from './features/board/BoardDetailPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<div>ログイン画面（実装予定）</div>} />
      <Route path="/register" element={<div>ユーザー登録画面（実装予定）</div>} />
      <Route path="/boards" element={<BoardListPage />} />
      <Route path="/boards/:boardId" element={<BoardDetailPage />} />
      <Route path="/settings/security" element={<div>セキュリティ設定（実装予定）</div>} />
      <Route path="/" element={<Navigate to="/boards" replace />} />
    </Routes>
  )
}

export default App
