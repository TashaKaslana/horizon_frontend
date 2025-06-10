'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export const CommentStatus = ["PENDING", "APPROVED", "REJECTED"] as const


const formSchema = z.object({
    updateStatus: z.boolean().optional(),
    status: z.enum(CommentStatus).optional(),

    updatePinned: z.boolean().optional(),
    isPinned: z.boolean().optional()
})

type FormValues = z.infer<typeof formSchema>

interface BulkCommentEditDialogProps {
    onConfirm: (data: Partial<FormValues>) => void;
    onClose: () => void;
    open: boolean;
}

export function BulkCommentEditDialog({open, onClose, onConfirm} :BulkCommentEditDialogProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            updateStatus: false,
            updatePinned: false
        }
    })

    const handleSubmit = (values: FormValues) => {
        const payload: Partial<FormValues> = {}

        if (values.updateStatus) payload.status = values.status
        if (values.updatePinned) payload.isPinned = values.isPinned

        onConfirm(payload)
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Bulk Edit Comments</DialogTitle>
                    <DialogDescription>Only selected fields will be applied to all selected comments.</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4 py-2"
                    >
                        {/* STATUS */}
                        <FormField
                            control={form.control}
                            name="updateStatus"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2 space-y-0">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className="font-medium">Change Status</FormLabel>
                                </FormItem>
                            )}
                        />

                        {form.watch('updateStatus') && (
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {CommentStatus.map((s) => (
                                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* PINNED */}
                        <FormField
                            control={form.control}
                            name="updatePinned"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2 space-y-0">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className="font-medium">Pin Comments</FormLabel>
                                </FormItem>
                            )}
                        />

                        {form.watch('updatePinned') && (
                            <FormField
                                control={form.control}
                                name="isPinned"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pinned</FormLabel>
                                        <Select value={String(field.value)} onValueChange={(val) => field.onChange(val === 'true')}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select pin state" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="true">Pinned</SelectItem>
                                                <SelectItem value="false">Unpinned</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <DialogFooter className="pt-4">
                            <Button type="submit">Apply Changes</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
