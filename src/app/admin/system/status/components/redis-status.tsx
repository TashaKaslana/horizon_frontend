import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {AlertTriangle, ExternalLink, Server} from "lucide-react";
import Link from "next/link";
import {useTranslations} from "next-intl";

interface RedisStatusProps {
    status: "online" | "offline";
    error?: string | null;
}

export const RedisStatus = ({status, error}: RedisStatusProps) => {
    const t = useTranslations("Admin.system.status");

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center">
                    <Server className="mr-2 h-5 w-5"/>
                    <CardTitle>{t("components.redis")}</CardTitle>
                </div>
                {status === "online" ? (
                    <Badge className="bg-green-500 hover:bg-green-600">{t("status.operational")}</Badge>
                ) : (
                    <Badge className="bg-red-500 hover:bg-red-600">{t("status.outage")}</Badge>
                )}
            </CardHeader>
            <CardContent>
                {status === 'offline' && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                        <AlertTriangle className="inline-block h-4 w-4 mr-1" />
                        {error || t("status.serviceDown")}
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full">
                    <Link href="https://redis.io/" target="_blank" className="flex items-center justify-center">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {t("viewDetails")}
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
};
