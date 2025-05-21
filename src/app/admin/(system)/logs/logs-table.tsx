import {DataTable} from "@/components/ui/data-table";
import {useEffect, useState} from "react";
import {LogItem} from "@/app/admin/(system)/logs/types";
import {columns} from "@/app/admin/(system)/logs/logs-columns";
import {mockActivity, mockErrors, mockSystemActivity} from "@/app/admin/components/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const LogsTable = () => {
    const [tab, setTab] = useState("system");
    const [data, setData] = useState<LogItem[]>([]);

    useEffect(() => {
        switch (tab) {
            case "system":
                setData(mockSystemActivity);
                break;
            case "activity":
                setData(mockActivity);
                break;
            // case "api":
            //     setData(mockApiLogs);
            //     break;
            case "error":
                setData(mockErrors);
                break;
            default:
                setData([]);
        }
    }, [tab]);

    return (
        <div className="p-4">
            <Tabs defaultValue="system" value={tab} onValueChange={setTab}>
                <TabsList className="mb-4">
                    <TabsTrigger value="system">System Logs</TabsTrigger>
                    <TabsTrigger value="activity">Activity Logs</TabsTrigger>
                    {/*<TabsTrigger value="api">API Logs</TabsTrigger>*/}
                    <TabsTrigger value="error">Error Logs</TabsTrigger>
                </TabsList>

                <TabsContent value={tab}>
                    <DataTable
                        columns={columns}
                        data={data}
                        setData={setData}
                        enableRowSelection={true}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}