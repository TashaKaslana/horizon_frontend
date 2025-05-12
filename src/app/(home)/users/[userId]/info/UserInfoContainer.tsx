'use client'

import {useUserHook} from "@/app/(home)/users/[userId]/hooks/useUserHook";
import {
    AtSign,
    BadgeCheck,
    CalendarDays,
    Eye,
    FileText,
    Globe,
    Mail,
    Quote,
    RefreshCw,
    Share,
    User,
    Flag
} from "lucide-react";
import {formatDateTS} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {useCallback} from "react";

interface UserInfoContainerProps {
    userId: string;
}

const UserInfoContainer = ({userId}: UserInfoContainerProps) => {
    const {user, totalAllPostCount, totalAllPostViewCount} = useUserHook(userId);

    const handleCopyProfileLink = useCallback(() => {
        const link = `${window.location.origin}/users/${userId}/overview`;
        navigator.clipboard.writeText(link).then();
        toast.success("Profile link copied!");
    }, [userId]);

    if (!user) return null;

    return (
        <div className="flex flex-col gap-8 px-16 pb-4">
            <h1 className="text-2xl font-bold">User Information</h1>

            <section className="space-y-2">
                <h2 className="text-lg font-semibold">Personal Info</h2>
                <p className="flex items-center gap-2">
                    <User className="w-4 h-4"/> {user.displayName || '-'}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                    <AtSign className="w-4 h-4"/> @{user.username}
                </p>
                <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4"/> {user.email || '-'}
                </p>
                <p className="flex items-center gap-2">
                    <Quote className="w-4 h-4"/> {user.bio || '-'}
                </p>
                <p className="flex items-center gap-2">
                    <Globe className="w-4 h-4"/> Location
                </p>
                <p className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4"/> Gender
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-lg font-semibold">Statistics</h2>
                <p className="flex items-center gap-2">
                    <FileText className="w-4 h-4"/> Total posts: {totalAllPostCount?.totalPosts ?? 0}
                </p>
                <p className="flex items-center gap-2">
                    <Eye className="w-4 h-4"/> Total views: {totalAllPostViewCount?.totalView ?? 0}
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-lg font-semibold">Meta</h2>
                <p className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="w-4 h-4"/> Joined {formatDateTS(new Date(user.createdAt))}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                    <RefreshCw className="w-4 h-4"/> Last updated:
                    {/*{user.updatedAt ? formatDateTS(new Date(user.updatedAt)) : '-'}*/}
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-lg font-semibold">Actions</h2>
                <div className={'flex gap-4'}>
                    <Button variant="outline" className=" flex items-center gap-2" onClick={handleCopyProfileLink}>
                        <Share className="w-4 h-4"/> Share Profile
                    </Button>
                    <Button variant="destructive" className="flex items-center gap-2" onClick={() => toast("Report sent (placeholder)")}>
                        <Flag className="w-4 h-4"/> Report User
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default UserInfoContainer;
