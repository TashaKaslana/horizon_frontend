import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Cloud, ExternalLink} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Progress} from "@/components/ui/progress";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CloudinaryStatusProps {
    status: "online" | "offline";
    latency_ms: string;
    last_checked: string;
    storage: {
        last_updated: string;
        date_requested: string;
        bandwidth: {
            usage: number;
            credits_usage: number;
        };
        objects: {
            usage: number;
        };
        resources: number;
        storage: {
            usage: number;
            credits_usage: number;
        };
        impressions: {
            usage: number;
            credits_usage: number;
        };
        requests: number;
        derived_resources: number;
        media_limits: {
            video_max_size_bytes: number;
            image_max_size_bytes: number;
            image_max_px: number;
            raw_max_size_bytes: number;
            asset_max_total_px: number;
        };
        credits: {
            usage: number;
            limit: number;
            used_percent: number;
        };
        transformations: {
            usage: number;
            credits_usage: number;
            breakdown: {
                sd_video_second: number;
                hd_video_second: number;
                transformation: number;
            };
        };
        seconds_delivered: {
            usage: number;
            credits_usage: number;
        };
        plan: string;
    };
}

export const CloudinaryStatus = ({status, latency_ms, last_checked, storage}: CloudinaryStatusProps) => {
    const formatBytes = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center">
                    <Cloud className="mr-2 h-5 w-5"/>
                    <CardTitle>Cloudinary</CardTitle>
                </div>
                {status === "online" ? (
                    <Badge className="bg-green-500 hover:bg-green-600">Online</Badge>
                ) : (
                    <Badge className="bg-red-500 hover:bg-red-600">Offline</Badge>
                )}
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                    <div>
                        <h3 className="font-medium mb-2">General Information</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Status:</span>
                                <span className={cn(status === 'online' ? "text-green-500" : "text-red-500")}>
                                    {status.at(0)?.toUpperCase() + status.substring(1)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Latency:</span>
                                <span>{latency_ms}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Plan:</span>
                                <span>{storage.plan}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Last Updated:</span>
                                <span>{storage.last_updated}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium mb-2">Usage Statistics</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Resources:</span>
                                <span>{storage.resources}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Derived Resources:</span>
                                <span>{storage.derived_resources}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Objects:</span>
                                <span>{storage.objects.usage}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Requests:</span>
                                <span>{storage.requests}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-medium mb-2">Storage & Bandwidth</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Storage:</span>
                                <span>{formatBytes(storage.storage.usage)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Bandwidth:</span>
                                <span>{formatBytes(storage.bandwidth.usage)}</span>
                            </div>
                        </div>

                    </div>
                    <div>
                        <h3 className="font-medium mb-2">Credits</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-muted-foreground">Credits Usage:</span>
                                    <span>
                                        {storage.credits.usage} / {storage.credits.limit}
                                    </span>
                                </div>
                                <Progress value={storage.credits.used_percent} className="h-2"/>
                                <div className="text-xs text-right mt-1 text-muted-foreground">
                                    {storage.credits.used_percent.toFixed(2)}% used
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Storage Credits:</span>
                                    <span>{storage.storage.credits_usage}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Bandwidth Credits:</span>
                                    <span>{storage.bandwidth.credits_usage}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Transformations Credits:</span>
                                    <span>{storage.transformations.credits_usage}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full">
                    <Link href={'https://console.cloudinary.com/console'} target={'_blank'} className={'flex items-center justify-center'}>
                        <ExternalLink className="mr-2 h-4 w-4"/>
                        Cloudinary Dashboard
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
