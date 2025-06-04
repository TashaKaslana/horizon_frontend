import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Database, ExternalLink} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";

interface DatabaseStatusProps {
    status: "online" | "offline";
}

export const DatabaseStatus = ({status} : DatabaseStatusProps) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center">
                    <Database className="mr-2 h-5 w-5"/>
                    <CardTitle>Database</CardTitle>
                </div>
                {status === "online" ? (
                    <Badge className="bg-green-500 hover:bg-green-600">Online</Badge>
                ) : (
                    <Badge className="bg-red-500 hover:bg-red-600">Offline</Badge>
                )}
            </CardHeader>
            <CardContent>
                <CardDescription>Database service status and metrics</CardDescription>
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => window.open("#", "_blank")}>
                    <ExternalLink className="mr-2 h-4 w-4"/>
                    Database Dashboard
                </Button>
            </CardFooter>
        </Card>
    )
}