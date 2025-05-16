import { z } from "zod"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2Icon, LoaderIcon } from "lucide-react"
import {
    DraggableRow
} from "@/components/common/data-table-components"

export const UserAdminSchema = z.object({
    id: z.number(),
    header: z.string(),
    type: z.string(),
    status: z.string(),
    createdAt: z.string(),
})

export const userAdminColumns: ColumnDef<z.infer<typeof UserAdminSchema>> = [
    {
        id: "drag",
        header: () => null,
        cell: ({ row }) => <DraggableRow id={row.original.id} />,
    },
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "header",
        header: "Header",
        cell: ({ row }) => {
            // return <TableCellViewer item={row.original} />
            return <></>
        },
        enableHiding: false,
    },
    {
        accessorKey: "type",
        header: "Section Type",
        cell: ({ row }) => (
            <div className="w-32">
                <Badge variant="outline" className="px-1.5 text-muted-foreground">
                    {row.original.type}
                </Badge>
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Badge
                variant="outline"
                className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
            >
                {row.original.status === "Done" ? (
                    <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
                ) : (
                    <LoaderIcon />
                )}
                {row.original.status}
            </Badge>
        ),
    },
]

