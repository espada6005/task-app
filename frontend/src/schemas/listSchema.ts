import { z } from 'zod';

export const listSchema = z.object({
    title: z
        .string()
        .min(1, 'タイトルを入力してください')
        .max(255, '255文字以内で入力してください'),
});

export type ListFormValues = z.infer<typeof listSchema>;
