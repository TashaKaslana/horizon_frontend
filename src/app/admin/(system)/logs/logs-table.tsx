import {DataTable} from "@/components/ui/data-table";
import {useEffect, useState} from "react";
import {columns} from "@/app/admin/(system)/logs/logs-columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAdminLogEntriesStore from "@/app/admin/(system)/logs/useLoggingStore";
import {useLoggingManagement} from "@/app/admin/(system)/logs/useLoggingManagement";
import {LogEntryDto} from "@/api/client";

export const LogsTable = () => {
    const [tab, setTab] = useState("all");

    return (
        <div className="p-4">
            <Tabs defaultValue="all" value={tab} onValueChange={setTab}>
                <TabsList className="mb-4">
                    <TabsTrigger value="all">All Logs</TabsTrigger>
                    <TabsTrigger value="system">System Logs</TabsTrigger>
                    <TabsTrigger value="error">Error Logs</TabsTrigger>
                </TabsList>

                {tab === "all" && <LogTab severities={["INFO", "WARNING", "ERROR", "CRITICAL"]}/>}
                {tab === "system" && <LogTab severities={["INFO", "WARNING"]} />}
                {tab === "error" && <LogTab severities={["ERROR", "CRITICAL"]} />}
            </Tabs>
        </div>
    );
};

const LogTab = ({ severities }: { severities: ("INFO" | "WARNING" | "ERROR" | "CRITICAL")[] }) => {
    const [data, setData] = useState<LogEntryDto[]>([]);
    const { logEntries } = useAdminLogEntriesStore();
    const {
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        hasNextPage,
        totalPages
    } = useLoggingManagement(severities);

    useEffect(() => {
        if (logEntries) {
            setData(logEntries);
        }
    }, [logEntries]);

    return (
        <TabsContent value={getTabKeyFromSeverities(severities)}>
            <DataTable
                columns={columns}
                data={data}
                setData={setData}
                enableRowSelection={true}
                isLoading={isLoading}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                pageCount={totalPages}
            />
        </TabsContent>
    );
};


const getTabKeyFromSeverities = (severities: ("INFO" | "WARNING" | "ERROR" | "CRITICAL")[]) => {
    const key = severities.join(",");
    switch (key) {
        case "INFO,WARNING,ERROR,CRITICAL":
            return "all";
        case "INFO,WARNING":
            return "system";
        case "ERROR,CRITICAL":
            return "error";
        default:
            return "all";
    }
};