'use client'

import {Badge} from "@/components/ui/badge"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Key, KeyRound, Database, Type, ArrowRight, ExternalLink} from "lucide-react"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
import useDBSchema from "@/app/admin/system/database-schema/hook/useDBSchema";
import {Spinner} from "@/components/ui/spinner";

function getTypeColor(type?: string) {
    if (!type) return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"

    const typeColors: { [key: string]: string } = {
        uuid: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
        varchar: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        integer: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        bool: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
        timestamp: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
        timestamptz: "bg-pink-200 text-pink-900 dark:bg-pink-800 dark:text-pink-200",
        date: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        float8: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
        jsonb: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
        text: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
        int4: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
    }
    return typeColors[type] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
}

export default function DatabaseSchema() {
    const {data: schema, isLoading}  = useDBSchema()

    if (!schema?.tables || isLoading) {
        return (
            <div className="flex items-center justify-center h-full bg-pink">
                <Spinner/>
                <p className="text-muted-foreground">Loading database schema...</p>
            </div>
        )
    }

    return (
        <TooltipProvider>
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center gap-3 mb-8">
                    <Database className="h-8 w-8 text-primary"/>
                    <div>
                        <h1 className="text-3xl font-bold">Database Schema</h1>
                        <p className="text-muted-foreground">Overview of database tables and their relationships</p>
                    </div>
                </div>

                <div className="grid gap-6">
                    {Object.entries(schema.tables).map(([tableName, columns]) => (
                        <Card key={tableName} className="w-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Database className="h-5 w-5"/>
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
                                            <TableHead className="w-[20%]">Column Name</TableHead>
                                            <TableHead className="w-[15%]">Type</TableHead>
                                            <TableHead className="w-[10%]">Size</TableHead>
                                            <TableHead className="w-[10%]">Nullable</TableHead>
                                            <TableHead className="w-[15%]">Keys</TableHead>
                                            <TableHead className="w-[30%]">Relationship</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {columns.map((column, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium w-[20%]">
                                                    <div className="flex items-center gap-2">
                                                        <Type className="h-4 w-4 text-muted-foreground"/>
                                                        {column.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="w-[15%]">
                                                    <Badge className={getTypeColor(column?.type)}>{column.type}</Badge>
                                                </TableCell>
                                                <TableCell className="w-[10%]">
                                                    {column.size ? (
                                                        <span
                                                            className="text-sm text-muted-foreground">{column.size}</span>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">—</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="w-[10%]">
                                                    <Badge variant={column.nullable ? "secondary" : "destructive"}>
                                                        {column.nullable ? "Yes" : "No"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="w-[15%]">
                                                    <div className="flex gap-1">
                                                        {column.isPrimaryKey && (
                                                            <Tooltip>
                                                                <TooltipTrigger>
                                                                    <Badge variant="default"
                                                                           className="flex items-center gap-1">
                                                                        <Key className="h-3 w-3"/>
                                                                        PK
                                                                    </Badge>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Primary Key</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                        {column.isForeignKey && (
                                                            <Tooltip>
                                                                <TooltipTrigger>
                                                                    <Badge variant="outline"
                                                                           className="flex items-center gap-1">
                                                                        <KeyRound className="h-3 w-3"/>
                                                                        FK
                                                                    </Badge>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Foreign Key</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                        {!column.isPrimaryKey && !column.isForeignKey && (
                                                            <span className="text-sm text-muted-foreground">—</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="w-[30%]">
                                                    {column.relationship ? (
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="flex items-center gap-1 text-sm bg-muted px-2 py-1 rounded-md">
                                                                <ExternalLink
                                                                    className="h-3 w-3 text-muted-foreground"/>
                                                                <span
                                                                    className="font-medium text-primary">{column.relationship.referencedTable}</span>
                                                                <ArrowRight className="h-3 w-3 text-muted-foreground"/>
                                                                <span
                                                                    className="text-muted-foreground">{column.relationship.referencedColumn}</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">—</span>
                                                    )}
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
                    <h3 className="font-semibold mb-3">Legend</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Key className="h-4 w-4"/>
                                <span>PK = Primary Key</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <KeyRound className="h-4 w-4"/>
                                <span>FK = Foreign Key</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <ExternalLink className="h-4 w-4"/>
                                <ArrowRight className="h-4 w-4"/>
                                <span>References another table</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Type className="h-4 w-4"/>
                                <span>Column Name</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Relationship Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <KeyRound className="h-5 w-5"/>
                            Relationship Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {Object.entries(schema.tables).map(([tableName, columns]) => {
                                const relationships = columns.filter((col) => col.relationship)
                                if (relationships.length === 0) return null

                                return (
                                    <div key={tableName} className="text-sm">
                                        <span className="font-medium text-primary">{tableName}</span>
                                        <span className="text-muted-foreground"> references: </span>
                                        {relationships.map((rel, idx) => (
                                            <span key={idx}>
                                                <span className="font-medium">{rel.relationship!.referencedTable}</span>
                                                {idx < relationships.length - 1 && ", "}
                                            </span>
                                        ))}
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TooltipProvider>
    )
}
