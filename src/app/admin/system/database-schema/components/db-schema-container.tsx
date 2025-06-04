import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Key, KeyRound, Database, Type } from "lucide-react"

interface Column {
    name: string
    type: string
    size?: number
    nullable: boolean
    is_primary_key: boolean
    is_foreign_key: boolean
}

interface Schema {
    [tableName: string]: Column[]
}

const sampleSchema: Schema = {
    users: [
        {
            name: "id",
            type: "UUID",
            size: 36,
            nullable: false,
            is_primary_key: true,
            is_foreign_key: false,
        },
        {
            name: "email",
            type: "VARCHAR",
            size: 255,
            nullable: false,
            is_primary_key: false,
            is_foreign_key: false,
        },
    ],
    posts: [
        {
            name: "id",
            type: "UUID",
            size: 36,
            nullable: false,
            is_primary_key: true,
            is_foreign_key: false,
        },
        {
            name: "user_id",
            type: "UUID",
            size: 36,
            nullable: false,
            is_primary_key: false,
            is_foreign_key: true,
        },
    ],
    user_profiles: [
        {
            name: "id",
            type: "UUID",
            size: 36,
            nullable: false,
            is_primary_key: true,
            is_foreign_key: true,
        },
        {
            name: "bio",
            type: "TEXT",
            size: undefined,
            nullable: true,
            is_primary_key: false,
            is_foreign_key: false,
        },
        {
            name: "avatar_url",
            type: "VARCHAR",
            size: 500,
            nullable: true,
            is_primary_key: false,
            is_foreign_key: false,
        },
    ],
}

function getTypeColor(type: string) {
    const typeColors: { [key: string]: string } = {
        UUID: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
        VARCHAR: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        INTEGER: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        BOOLEAN: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
        TIMESTAMP: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
        TEXT: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    }
    return typeColors[type] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
}

export default function DatabaseSchema({ schema = sampleSchema }: { schema?: Schema }) {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <Database className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold">Database Schema</h1>
                    <p className="text-muted-foreground">Overview of database tables and their structure</p>
                </div>
            </div>

            <div className="grid gap-6">
                {Object.entries(schema).map(([tableName, columns]) => (
                    <Card key={tableName} className="w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5" />
                                {tableName}
                                <Badge variant="outline" className="ml-auto">
                                    {columns.length} {columns.length === 1 ? "column" : "columns"}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[25%]">Column Name</TableHead>
                                        <TableHead className="w-[20%]">Type</TableHead>
                                        <TableHead className="w-[15%]">Size</TableHead>
                                        <TableHead className="w-[15%]">Nullable</TableHead>
                                        <TableHead className="w-[25%]">Keys</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {columns.map((column, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium w-[25%]">
                                                <div className="flex items-center gap-2">
                                                    <Type className="h-4 w-4 text-muted-foreground" />
                                                    {column.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="w-[20%]">
                                                <Badge className={getTypeColor(column.type)}>{column.type}</Badge>
                                            </TableCell>
                                            <TableCell className="w-[15%]">
                                                {column.size ? (
                                                    <span className="text-sm text-muted-foreground">{column.size}</span>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="w-[15%]">
                                                <Badge variant={column.nullable ? "secondary" : "destructive"}>
                                                    {column.nullable ? "Yes" : "No"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="w-[25%]">
                                                <div className="flex gap-1">
                                                    {column.is_primary_key && (
                                                        <Badge variant="default" className="flex items-center gap-1">
                                                            <Key className="h-3 w-3" />
                                                            PK
                                                        </Badge>
                                                    )}
                                                    {column.is_foreign_key && (
                                                        <Badge variant="outline" className="flex items-center gap-1">
                                                            <KeyRound className="h-3 w-3" />
                                                            FK
                                                        </Badge>
                                                    )}
                                                    {!column.is_primary_key && !column.is_foreign_key && (
                                                        <span className="text-sm text-muted-foreground">—</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-8 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Legend</h3>
                <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        <span>PK = Primary Key</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4" />
                        <span>FK = Foreign Key</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        <span>Column Name</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
