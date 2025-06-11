'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";

const formSchema = z.object({
    applyRole: z.boolean().optional(),
    roleId: z.string().optional(),

    applyStatus: z.boolean().optional(),
    status: z.enum(["ACTIVE" , "PENDING" , "SUSPENDED" , "DEACTIVATED"]).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BulkEditUsersDialogProps {
    open: boolean;
    onOpenChangeAction: (open: boolean) => void;
    onSubmitAction: (values: FormValues) => void;
    loading?: boolean;
}

export function BulkEditUsersDialog({ open, onOpenChangeAction, onSubmitAction, loading }: BulkEditUsersDialogProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            applyRole: false,
            applyStatus: false,
            roleId: undefined,
            status: undefined,
        },
    });

    useEffect(() => {
        if (!open) form.reset();
    }, [form, open]);

    const handleSubmit = (values: FormValues) => {
        const payload: Partial<FormValues> = {};
        if (values.applyStatus) payload.status = values.status;
        if (values.applyRole) payload.roleId = values.roleId;
        onSubmitAction(payload);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChangeAction}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Bulk Edit Users</DialogTitle>
                    <DialogDescription>
                        Apply changes to selected users.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
                        <FormField
                            control={form.control}
                            name="applyRole"
                            render={({ field }) => (
                                <FormItem>
                                    <div className={'flex gap-2 items-center'}>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        <FormLabel>Change Role</FormLabel>
                                    </div>
                                    {field.value && (
                                        <FormField
                                            control={form.control}
                                            name="roleId"
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select role" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                                        <SelectItem value="MODERATOR">Moderator</SelectItem>
                                                        <SelectItem value="USER">User</SelectItem>
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
                                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                                        <SelectItem value="PENDING">Pending</SelectItem>
                                                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
                                                        <SelectItem value="DEACTIVATED">Deactivated</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    )}
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => onOpenChangeAction(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Saving..." : "Apply Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
