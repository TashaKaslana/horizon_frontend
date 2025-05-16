import {Button} from "@/components/ui/button";
import {useUserHook} from "@/app/(home)/users/[userId]/hooks/useUserHook";
import {Dot} from "lucide-react";
import {getFixedNumberFormat} from "@/lib/utils";
import {useMutation} from "@tanstack/react-query";
import {followUser, unfollowUser} from "@/api/followApi";
import {toast} from "sonner";
import {useCurrentUser} from "@/stores/useCurrentUser";
import TruncatedText from "@/components/common/truncated-text";
import {ImageUpload} from "@/app/components/avatar_upload/avatar-upload";
import {UnVerifiedBadge} from "@/components/common/verified-badge";

export function UserOverviewAppearance({userId}: { userId: string }) {
    const {user, followOverview} = useUserHook(userId)

    const {user: me} = useCurrentUser()

    const mutation = useMutation({
        mutationFn: async () => {
            if (followOverview?.isMeFollowing) {
                return await unfollowUser(userId)
            } else {
                return await followUser(userId)
            }
        },
        onError: error => {
            console.log(error)
            toast.error("Error when follow user")
        }
    })

    const handleFollow = () => {
        mutation.mutate()
    }

    return <header className={"space-y-2"}>
        {user?.profileImage ? (
            <ImageUpload
                imageUrl={user?.coverImage}
                placeholder={''}
                variant={"cover"}
            />
        ) : (
            <div className={"h-24 w-full bg-sky-400 rounded-lg"}/>
        )}
        <div className={"flex"}>
            <ImageUpload
                imageUrl={user?.profileImage}
                placeholder={user?.displayName?.substring(0, 2)}
                variant={"avatar"}
            />
            <div>
                <div className={"flex flex-col ml-5 gap-1"}>
                    <h3 className={"text-3xl font-semibold flex gap-2 items-center"}>
                        <span>{user?.displayName ?? user?.username}</span>
                        <span>{!user?.displayName && <UnVerifiedBadge/>}</span>
                    </h3>
                    <div className={'flex gap-1 text-sm text-muted-foreground items-center'}>
                        <p className={"italic text-sm text-muted-foreground"}>@{user?.username}</p>
                        <Dot/>
                        <p>Followers {getFixedNumberFormat(followOverview?.totalFollowers ?? 0)}</p>
                        <Dot/>
                        <p>Followers {getFixedNumberFormat(followOverview?.totalFollowing ?? 0)}</p>
                    </div>
                    <TruncatedText text={user?.bio ?? ''}
                                   textClassName={'text-zinc-700'}
                    />
                    {me?.id !== user?.id && (
                        <Button onClick={handleFollow}
                                className={'w-1/2'}>{followOverview?.isMeFollowing ? 'UnFollowing' : 'Follow'}</Button>
                    )}
                </div>
            </div>
        </div>
    </header>;
}