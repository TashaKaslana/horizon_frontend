import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import {useEffect} from "react";
import useCategoryStore from "@/app/admin/posts/categories/store/useCategoryStore";
import {useCategoryManagement} from "@/app/admin/posts/categories/hooks/useCategoryManagement";
import {Loader2} from "lucide-react";

const STATUS = {
    DRAFT: "DRAFT",
    PENDING_REVIEW: "PENDING_REVIEW",
    PUBLISHED: "PUBLISHED",
    REJECTED: "REJECTED",
    ARCHIVED: "ARCHIVED"
} as const;

const STATUS_DISPLAY = {
    [STATUS.DRAFT]: "Draft",
    [STATUS.PENDING_REVIEW]: "Pending Review",
    [STATUS.PUBLISHED]: "Published",
    [STATUS.REJECTED]: "Rejected",
    [STATUS.ARCHIVED]: "Archived"
};

const STATUS_VALUES = Object.values(STATUS) as [string, ...string[]];
export const StatusEnum = z.enum(STATUS_VALUES);

const formSchema = z.object({
    applyStatus: z.boolean().optional(),
    status: StatusEnum.optional(),

    applyVisibility: z.boolean().optional(),
    visibility: z.enum(["PUBLIC", "PRIVATE", "FRIEND"]).optional(),

    applyCategory: z.boolean().optional(),
    categoryId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BulkPostEditDialogProps {
    onConfirm: (data: Partial<FormValues>) => void;
    onClose: () => void;
    open: boolean;
}

export function BulkPostEditDialog({open, onClose, onConfirm}: BulkPostEditDialogProps) {
    const {categories} = useCategoryStore();
    const {isLoading: isCategoriesLoading} = useCategoryManagement();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            applyStatus: false,
            status: STATUS.DRAFT,
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
                            render={({field}) => (
                                <FormItem>
                                    <div className={'flex gap-2 items-center'}>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
                                        <FormLabel>Change Status</FormLabel>
                                    </div>
                                    {field.value && (
                                        <FormField
                                            control={form.control}
                                            name="status"
                                            render={({field}) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select status"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Object.entries(STATUS).map(([key, value]) => (
                                                            <SelectItem key={value} value={value}>
                                                                {STATUS_DISPLAY[value] || key}
                                                            </SelectItem>
                                                        ))}
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
                            render={({field}) => (
                                <FormItem>
                                    <div className={'flex gap-2 items-center'}>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
                                        <FormLabel>Change Visibility</FormLabel>
                                    </div>
                                    {field.value && (
                                        <FormField
                                            control={form.control}
                                            name="visibility"
                                            render={({field}) => (
                                                <Select onValueChange={field.onChange} value={field.value || ''}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select visibility"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="PUBLIC">Public</SelectItem>
                                                        <SelectItem value="PRIVATE">Private</SelectItem>
                                                        <SelectItem value="FRIEND">Followers</SelectItem>
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
                                    <div className="flex gap-2 items-center">
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        <FormLabel>Change Category</FormLabel>
                                    </div>

                                    {field.value && (
                                        <FormField
                                            control={form.control}
                                            name="categoryId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value || ''}
                                                        disabled={isCategoriesLoading}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                {isCategoriesLoading ? (
                                                                    <div className="flex items-center">
                                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                        <span>Loading categories...</span>
                                                                    </div>
                                                                ) : (
                                                                    <SelectValue placeholder="Select category" />
                                                                )}
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {categories.map((category) => (
                                                                <SelectItem key={category.id} value={category.id!}>
                                                                    {category.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormItem>
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
