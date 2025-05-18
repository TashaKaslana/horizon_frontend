import { z } from 'zod';

export const AssetSummarySchema = z.object({
    id: z.string(),
    publicId: z.string(),
    resourceType: z.string(),
    format: z.string(),
    secureUrl: z.string().url(),
    bytes: z.number(),
    width: z.number(),
    height: z.number(),
    originalFilename: z.string(),
    createdAt: z.string(), // or z.coerce.date()
    createdBy: z.string(),
});

export const CreateAssetSchema = AssetSummarySchema.omit({
    id: true,
    createdBy: true,
    createdAt: true,
});

// Inferred types (optional)
export type AssetSummary = z.infer<typeof AssetSummarySchema>;
export type CreateAsset = z.infer<typeof CreateAssetSchema>;
