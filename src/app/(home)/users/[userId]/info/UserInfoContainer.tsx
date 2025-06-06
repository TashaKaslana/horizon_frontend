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
    Flag, Pencil
} from "lucide-react";
import {formatDateTS} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {useCallback} from "react";
import {useCurrentUser} from "@/stores/useCurrentUser";
import Link from "next/link";
import {useTranslations} from "next-intl";

interface UserInfoContainerProps {
    userId: string;
}

const UserInfoContainer = ({userId}: UserInfoContainerProps) => {
    const {user, totalAllPostCount, totalAllPostViewCount} = useUserHook(userId);
    const {user: currentUser} = useCurrentUser();
    const t = useTranslations('Home.user_profile.info');
    const profileT = useTranslations('Home.user_profile.profile');
    const statsT = useTranslations('Home.user_profile.stats');

    const handleCopyProfileLink = useCallback(() => {
        const link = `${window.location.origin}/users/${userId}/overview`;
        navigator.clipboard.writeText(link).then();
        toast.success(`${t('profile_link_copied!')}\n ${link}`)
    }, [t, userId]);

    if (!user) return null;

    return (
        <div className="flex flex-col gap-8 px-16 pb-4">
            <h1 className="text-2xl font-bold">{t('about')}</h1>

            <section className="space-y-2">
                <h2 className="text-lg font-semibold">{t('personal_info')}</h2>
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
                    <Quote className="w-4 h-4"/> {user.bio || t('not_specified')}
                </p>
                <p className="flex items-center gap-2">
                    <Globe className="w-4 h-4"/> {t('location')}
                </p>
                <p className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4"/> {t('gender')}
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-lg font-semibold">{t('statistics')}</h2>
                <p className="flex items-center gap-2">
                    <FileText className="w-4 h-4"/> {statsT('posts')}: {totalAllPostCount?.totalPosts ?? 0}
                </p>
                <p className="flex items-center gap-2">
                    <Eye className="w-4 h-4"/> {t('total_views')}: {totalAllPostViewCount?.totalView ?? 0}
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-lg font-semibold">{t('meta')}</h2>
                <p className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="w-4 h-4"/> {t('joined')} {formatDateTS(new Date(user.createdAt))}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                    <RefreshCw className="w-4 h-4"/> {t('last_updated')}:
                    {/*{user.updatedAt ? formatDateTS(new Date(user.updatedAt)) : '-'}*/}
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-lg font-semibold">{t('actions')}</h2>
                <div className={'flex gap-4'}>
                    {currentUser?.id === userId && <Link href={'/profile/edit'}>
                        <Button variant='outline' className="flex items-center gap-2">
                            <Pencil className="w-4 h-4"/> {profileT('edit_profile')}
                        </Button>
                    </Link>}
                    <Button variant="outline" className=" flex items-center gap-2" onClick={handleCopyProfileLink}>
                        <Share className="w-4 h-4"/> {t('share_profile')}
                    </Button>
                    <Button variant="destructive" className="flex items-center gap-2"
                            onClick={() => toast("Report sent (placeholder)")}>
                        <Flag className="w-4 h-4"/> {t('report_user')}
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default UserInfoContainer;
