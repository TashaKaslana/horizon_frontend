import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {ExternalLink, Settings} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useTranslations} from "next-intl";

interface MaintenanceStatusProps {
    status: boolean;
}

export const MaintenanceStatus = ({status} : MaintenanceStatusProps) => {
    const t = useTranslations("Admin.system");

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    <CardTitle>{t("status.components.maintenance")}</CardTitle>
                </div>
                {status ? (
                    <Badge className="bg-blue-500 hover:bg-blue-600">{t("status.status.maintenance")}</Badge>
                ) : (
                    <Badge className="bg-green-500 hover:bg-green-600">{t("status.status.operational")}</Badge>
                )}
            </CardHeader>
            <CardContent>
                <CardDescription>
                    {status
                        ? t("maintenance.messages.defaultMessage")
                        : t("maintenance.settings.scheduledMaintenance")}
                </CardDescription>
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full">
                    <Link href={'/admin/system/maintenance'} className={'flex items-center justify-between'}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {t("maintenance.title")}
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
