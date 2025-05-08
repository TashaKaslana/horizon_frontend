import {UserSummary} from "@/types/user";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";

export function UserOverviewAppearance(props: { user: UserSummary }) {
    return <header className={"space-y-2"}>
        {props.user?.profileImage && (
            <div className={"h-24 w-full bg-sky-400 rounded-lg"}/>
        )}
        <div className={"flex"}>
            <div>
                <Avatar className={"size-32"}>
                    <AvatarImage
                        src={props.user?.profileImage}
                        alt={props.user?.displayName?.substring(0, 2)}
                    />
                    <AvatarFallback>{props.user?.displayName?.substring(0, 2)}</AvatarFallback>
                </Avatar>
            </div>
            <div>
                <div className={"flex flex-col ml-5 gap-1"}>
                    <h1 className={"text-3xl font-semibold"}>{props.user?.displayName}</h1>
                    <p className={"italic text-sm text-muted-foreground"}>@{props.user?.username}</p>
                    <p className={"text-zinc-700"}>#bio</p>
                    <Button>Follow</Button>
                </div>
            </div>
        </div>
    </header>;
}