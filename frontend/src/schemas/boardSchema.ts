import { z } from 'zod';

export const boardSchema = z.object({
    title: z
        .string()
        .min(1, 'タイトルを入力してください')
        .max(255, '255文字以内で入力してください'),
});

export type BoardFormValues = z.infer<typeof boardSchema>;
