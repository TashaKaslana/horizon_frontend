import {
    Compass, House,
    MailboxIcon,
    PackageSearch, Upload,
    User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

export type NavigationItem = {
    title: string;
    icon: ReactNode;
    href: string;
};

export const useNavigationData = (): NavigationItem[] => {
    const t = useTranslations('Home');
    const navigationItems = t.raw('navigation');

    const iconMap = {
        "/foryou": <House />,
        "/discover": <Compass />,
        "/management": <PackageSearch />,
        "/uploads": <Upload />,
        "/following": <User />,
        "/notifications": <MailboxIcon />
    } as const;

    type IconHref = keyof typeof iconMap;

    return navigationItems.map((item: NavigationItem) => ({
        title: item.title,
        icon: iconMap[item.href as IconHref],
        href: item.href
    }));
};
