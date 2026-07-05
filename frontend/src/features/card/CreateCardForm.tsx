import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cardCreateSchema, type CardCreateFormValues } from '../../schemas/cardSchema';
import { useCreateCard } from '../../hooks/useCards';

type Props = {
  boardId: number;
  listId: number;
};

export function CreateCardForm({ boardId, listId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const createCard = useCreateCard(boardId);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CardCreateFormValues>({
    resolver: zodResolver(cardCreateSchema),
  });

  const onSubmit = (values: CardCreateFormValues) => {
    createCard.mutate(
      { listId, title: values.title },
      {
        onSuccess: () => {
          reset();
        },
      }
    );
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full text-left text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg px-2 py-1.5 transition-colors"
      >
        + カードを追加
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <textarea
        {...register('title')}
        placeholder="カードのタイトル"
        rows={2}
        autoFocus
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
          }
          if (e.key === 'Escape') {
            setIsOpen(false);
            reset();
          }
        }}
      />
      {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
      <div className="flex items-center gap-2 mt-2">
        <button
          type="submit"
          disabled={createCard.isPending}
          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          追加
        </button>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            reset();
          }}
          className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
