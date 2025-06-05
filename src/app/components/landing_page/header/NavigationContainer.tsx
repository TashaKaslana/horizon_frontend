import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {ReactNode} from "react";

type NavItem = {
    title: string;
    description?: string;
    href: string;
};

type AccountLink = {
    title: string;
    href: string;
};

export default function NavigationContainer() {
    const t = useTranslations('LandingPage.navigation');

    const gettingStarted = t.raw('Getting started');
    const discover = t.raw('Discover');
    const aboutProject = t.raw('About Project');
    const documentation = t.raw('Documentation');

    return (
        <div className="absolute left-1/2 transform -translate-x-1/2">
            <NavigationMenu viewport={false}>
                <NavigationMenuList>
                    {/* Getting Started */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="font-semibold text-lg">
                            {gettingStarted.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="min-w-64 grid gap-2 absolute">
                            {gettingStarted.items.map((item: NavItem, idx: number) => (
                                <ItemComposition key={idx} src={item.href} title={item.title}>
                                    {item.description}
                                </ItemComposition>
                            ))}
                            <div className="p-2 mt-2 bg-muted/50 rounded-md">
                                <h3 className="font-medium mb-1 text-sm">{gettingStarted.account.title}</h3>
                                <div className="grid gap-1">
                                    {gettingStarted.account.links.map((link: AccountLink, idx: number) => (
                                        <NavigationMenuLink key={idx} asChild className="w-full">
                                            <Link href={link.href}>{link.title}</Link>
                                        </NavigationMenuLink>
                                    ))}
                                </div>
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Discover */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="font-semibold text-lg">
                            {discover.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="min-w-64 grid gap-2 absolute">
                            {discover.items.map((item: NavItem, idx: number) => (
                                <ItemComposition key={idx} src={item.href} title={item.title}>
                                    {item.description}
                                </ItemComposition>
                            ))}
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* About Project */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="font-semibold text-lg">
                            {aboutProject.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="min-w-64 grid gap-2 absolute">
                            {aboutProject.items.map((item: NavItem, idx: number) => (
                                <ItemComposition key={idx} src={item.href} title={item.title}>
                                    {item.description}
                                </ItemComposition>
                            ))}
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Documentation */}
                    <NavigationMenuItem>
                        <Link href={documentation.href} legacyBehavior passHref>
                            <NavigationMenuLink className="font-semibold text-lg py-2 px-4">
                                {documentation.title}
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>

                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
}

const ItemComposition = ({
                             title,
                             children,
                             src
                         }: {
    title: string;
    children: ReactNode;
    src: string;
}) => {
    return (
        <NavigationMenuLink asChild>
            <Link href={src} className="block p-3 rounded-md hover:bg-accent space-y-1">
                <h1 className="font-bold text-base">{title}</h1>
                <p className="text-sm text-muted-foreground">{children}</p>
            </Link>
        </NavigationMenuLink>
    );
};