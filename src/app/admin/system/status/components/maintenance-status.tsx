import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {ExternalLink, Settings} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";

interface MaintenanceStatusProps {
    status: boolean;
}

export const MaintenanceStatus = ({status} : MaintenanceStatusProps) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    <CardTitle>Maintenance</CardTitle>
                </div>
                {status ? (
                    <Badge className="bg-blue-500 hover:bg-blue-600">Active</Badge>
                ) : (
                    <Badge className="bg-green-500 hover:bg-green-600">Inactive</Badge>
                )}
            </CardHeader>
            <CardContent>
                <CardDescription>
                    {status
                        ? "System is currently under maintenance. Some services may be affected."
                        : "No maintenance is currently scheduled."}
                </CardDescription>
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => window.open("#", "_blank")}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Maintenance Schedule
                </Button>
            </CardFooter>
        </Card>
    )
}
