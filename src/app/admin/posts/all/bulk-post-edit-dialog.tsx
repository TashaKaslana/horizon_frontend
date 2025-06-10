import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect } from "react";

const formSchema = z.object({
    applyStatus: z.boolean().optional(),
    status: z.enum(["DRAFT", "PROCESSING", "READY", "BANNED"]).optional(),

    applyVisibility: z.boolean().optional(),
    visibility: z.enum(["PUBLIC", "PRIVATE", "FOLLOWERS"]).optional(),

    applyCategory: z.boolean().optional(),
    categoryId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BulkPostEditDialogProps {
    onConfirm: (data: Partial<FormValues>) => void;
    onClose: () => void;
    open: boolean;
}

export function BulkPostEditDialog({ open, onClose, onConfirm }: BulkPostEditDialogProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            applyStatus: false,
            applyVisibility: false,
            applyCategory: false,
        },
    });

    useEffect(() => {
        if (!open) form.reset();
    }, [form, open]);

    const handleSubmit = (values: FormValues) => {
        const payload: Partial<FormValues> = {};
        if (values.applyStatus) payload.status = values.status;
        if (values.applyVisibility) payload.visibility = values.visibility;
        if (values.applyCategory) payload.categoryId = values.categoryId;
        onConfirm(payload);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Posts</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="applyStatus"
                            render={({ field }) => (
                                <FormItem>
                                    <div className={'flex gap-2 items-center'}>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        <FormLabel>Change Status</FormLabel>
                                    </div>
                                    {field.value && (
                                        <FormField
                                            control={form.control}
                                            name="status"
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="DRAFT">Draft</SelectItem>
                                                        <SelectItem value="PROCESSING">Processing</SelectItem>
                                                        <SelectItem value="READY">Ready</SelectItem>
                                                        <SelectItem value="BANNED">Banned</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    )}
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="applyVisibility"
                            render={({ field }) => (
                                <FormItem>
                                    <div className={'flex gap-2 items-center'}>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        <FormLabel>Change Visibility</FormLabel>
                                    </div>
                                    {field.value && (
                                        <FormField
                                            control={form.control}
                                            name="visibility"
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select visibility" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="PUBLIC">Public</SelectItem>
                                                        <SelectItem value="PRIVATE">Private</SelectItem>
                                                        <SelectItem value="FOLLOWERS">Followers</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    )}
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="applyCategory"
                            render={({ field }) => (
                                <FormItem>
                                    <div className={'flex gap-2 items-center'}>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        <FormLabel>Change Category</FormLabel>
                                    </div>
                                    {field.value && (
                                        <FormField
                                            control={form.control}
                                            name="categoryId"
                                            render={({ field }) => (
                                                <input
                                                    type="text"
                                                    placeholder="Category ID"
                                                    value={field.value ?? ''}
                                                    onChange={e => field.onChange(e.target.value)}
                                                    className="input"
                                                />
                                            )}
                                        />
                                    )}
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit">Update</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
