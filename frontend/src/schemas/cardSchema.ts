import { z } from 'zod'

export const cardCreateSchema = z.object({
    title: z
        .string()
        .min(1, 'タイトルを入力してください')
        .max(255, '255文字以内で入力してください'),
})

export type CardCreateFormValues = z.infer<typeof cardCreateSchema>

export const cardDetailSchema = z.object({
    title: z
        .string()
        .min(1, 'タイトルを入力してください')
        .max(255, '255文字以内で入力してください'),
    description: z.string().max(2000, '2000文字以内で入力してください').optional(),
    dueDate: z.string().optional(),
})

export type CardDetailFormValues = z.infer<typeof cardDetailSchema>
