import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {AlertTriangle, ExternalLink, XCircle} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import Link from "next/link";

interface Auth0StatusProps {
    status: "online" | "offline";
    latency_ms: string;
    last_checked: string;
    error?: string
}

export const Auth0Status = ({status, latency_ms, last_checked}: Auth0StatusProps) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center">
                    <svg
                        className="mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    </svg>
                    <CardTitle>Auth0</CardTitle>
                </div>
                {status === "online" ? (
                    <Badge className="bg-green-500 hover:bg-green-600">Online</Badge>
                ) : (
                    <Badge className="bg-red-500 hover:bg-red-600">Offline</Badge>
                )}
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className={`font-medium flex items-center ${status === 'online' ? 'text-green-500' : 'text-red-500'}`}>
                            {status === 'online' ? (
                                <>Online</>
                            ) : (
                                <>
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Offline
                                </>
                            )}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Latency:</span>
                        <span>{latency_ms}</span>
                    </div>
                    {status === 'offline' && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                            <AlertTriangle className="inline-block h-4 w-4 mr-1" />
                            Authentication service is currently down. Users may experience login issues.
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full">
                    <Link href="https://manage.auth0.com/" target="_blank" className="flex items-center justify-center">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Auth0 Dashboard
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
