import {z} from "zod";

export const LogEntrySchema = z.object({
    id: z.string(),
    timestamp: z.string(), // ISO
    severity: z.enum(["info", "warning", "error", "critical"]),
    message: z.string(),
    source: z.string(), // e.g., "CommentService", "Ably", "StorageService"
    userId: z.string().optional(), // optional
    context: z.record(z.string(), z.any()).optional(), // for extra data
});

export const LogEntryListSchema = z.object({
    logs: z.array(LogEntrySchema),
    total: z.number(),
});

export type LogEntry = z.infer<typeof LogEntrySchema>;
export type LogEntryList = z.infer<typeof LogEntryListSchema>;