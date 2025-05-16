import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {BadgeAlert} from "lucide-react";

export const UnVerifiedBadge = ({className}: { className?: string }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <BadgeAlert className={'text-orange-300'}/>
                </TooltipTrigger>
                <TooltipContent className={'bg-white/80 border ' + className}>
                    <p className={'text-sm font-semibold text-orange-500'}>Unverified</p>
                    <p className={'text-sm font-light text-orange-300 flex flex-col'}>
                        <span>This account is unverified by the system</span>
                        <span>You need complete your profile</span>
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
