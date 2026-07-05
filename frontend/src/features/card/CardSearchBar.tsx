import { useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import { selectedCardIdAtom } from '../../atoms/cardAtoms';
import { useSearchCards } from '../../hooks/useCards';

type Props = {
  boardId: number;
};

function isOverdue(dueDate: string | null) {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

export function CardSearchBar({ boardId }: Props) {
  const [title, setTitle] = useState('');
  const [debouncedTitle, setDebouncedTitle] = useState('');
  const [dueDateBefore, setDueDateBefore] = useState('');
  const [overdue, setOverdue] = useState(false);
  const setSelectedCardId = useSetAtom(selectedCardIdAtom);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTitle(title.trim()), 300);
    return () => clearTimeout(timer);
  }, [title]);

  const hasFilter = debouncedTitle !== '' || dueDateBefore !== '' || overdue;

  const { data: results, isFetching } = useSearchCards(
    boardId,
    {
      title: debouncedTitle || undefined,
      dueDateBefore: dueDateBefore || undefined,
      overdue: overdue || undefined,
    },
    hasFilter
  );

  const handleClear = () => {
    setTitle('');
    setDueDateBefore('');
    setOverdue(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 flex-wrap">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="カードをタイトルで検索..."
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={dueDateBefore}
          onChange={(e) => setDueDateBefore(e.target.value)}
          title="この日付以前が期限のカードを表示"
          className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label className="flex items-center gap-1.5 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={overdue}
            onChange={(e) => setOverdue(e.target.checked)}
          />
          期限切れのみ
        </label>
        {hasFilter && (
          <button
            onClick={handleClear}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            クリア
          </button>
        )}
      </div>

      {hasFilter && (
        <div className="absolute left-0 z-40 mt-2 w-96 max-h-80 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg">
          {isFetching ? (
            <p className="text-sm text-gray-400 px-4 py-3">検索中...</p>
          ) : results && results.length > 0 ? (
            results.map((card) => (
              <button
                key={card.id}
                onClick={() => setSelectedCardId(card.id)}
                className="w-full text-left px-4 py-2.5 hover:bg-gray-50 border-b border-gray-100 last:border-0"
              >
                <p className="text-sm text-gray-800 break-words">{card.title}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {card.listTitle}
                  {card.dueDate && (
                    <span className={isOverdue(card.dueDate) ? 'text-red-500' : ''}>
                      {' · '}
                      {new Date(card.dueDate).toLocaleDateString('ja-JP')}
                    </span>
                  )}
                </p>
              </button>
            ))
          ) : (
            <p className="text-sm text-gray-400 px-4 py-3">該当するカードがありません</p>
          )}
        </div>
      )}
    </div>
  );
}
