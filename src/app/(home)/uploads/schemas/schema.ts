import { z } from "zod";

const createUploadSchema = (t: any) => z.object({
    title: z.string().min(1, t('form.title.error')),
    description: z.string()
        .min(10, t('form.description.error'))
        .optional(),
    visibility: z.enum(["PRIVATE", "FRIEND", "PUBLIC"]),
    category: z.string().min(1, t('form.category.error')),
    allowComments: z.boolean().default(true),
    ageRestricted: z.boolean().default(false),
    file: z.instanceof(File, { message: t('dropzone.errors.invalidType') }).optional(),
});

export type UploadFormInputs = z.infer<ReturnType<typeof createUploadSchema>>;

export { createUploadSchema };
