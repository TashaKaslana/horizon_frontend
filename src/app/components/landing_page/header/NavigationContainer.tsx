import {
    NavigationMenu, NavigationMenuContent,
    NavigationMenuItem, NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import {ReactNode} from "react";
import Link from "next/link";

const NavigationContainer = () => {
    return (
        <div className={'absolute left-1/2 transform -translate-x-1/2'}>
            <NavigationMenu viewport={false}>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className={'font-semibold text-lg'}>
                            Getting started
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className={'min-w-64 grid gap-2 absolute'}>
                            <ItemComposition src={'#'} title={'How to use'}>
                                Guide you to use our project Horizon
                            </ItemComposition>
                            <ItemComposition src={'#'} title={'Quick Start'}>
                                Get up and running in under 5 minutes
                            </ItemComposition>
                            <div className="p-2 mt-2 bg-muted/50 rounded-md">
                                <h3 className="font-medium mb-1 text-sm">Account</h3>
                                <div className="grid gap-1">
                                    <NavigationMenuLink asChild className={'w-full'}>
                                        <Link href="#">Login</Link>
                                    </NavigationMenuLink>
                                    <NavigationMenuLink asChild className={'w-full'}>
                                        <Link href="#">Sign up</Link>
                                    </NavigationMenuLink>
                                </div>
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuTrigger className={'font-semibold text-lg'}>
                            Discover
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className={'min-w-64 grid gap-2'}>
                            <ItemComposition src={'#'} title={'Features'}>
                                Explore the powerful features of Horizon
                            </ItemComposition>
                            <ItemComposition src={'#'} title={'Showcase'}>
                                See what others have built with Horizon
                            </ItemComposition>
                            <ItemComposition src={'#'} title={'Community'}>
                                Join our growing community of developers
                            </ItemComposition>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuTrigger className={'font-semibold text-lg'}>
                            About Project
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className={'min-w-64 grid gap-2 absolute'}>
                            <ItemComposition src={'#'} title={'Our Mission'}>
                                Learn about the goals and vision behind Horizon
                            </ItemComposition>
                            <ItemComposition src={'#'} title={'Team'}>
                                Meet the people behind the project
                            </ItemComposition>
                            <ItemComposition src={'#'} title={'Roadmap'}>
                                See what we have planned for the future
                            </ItemComposition>
                            <ItemComposition src={'#'} title={'Contact Us'}>
                                Get in touch with our support team
                            </ItemComposition>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <Link href="#" legacyBehavior passHref>
                            <NavigationMenuLink className={'font-semibold text-lg py-2 px-4'}>
                                Documentation
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}

const ItemComposition = ({title, children, src}: { title: string, children: ReactNode, src: string }) => {
    return (
        <NavigationMenuLink asChild>
            <Link href={src} className={'block p-3 rounded-md hover:bg-accent space-y-1'}>
                <h1 className={'font-bold text-base'}>{title}</h1>
                <p className={'text-sm text-muted-foreground'}>{children}</p>
            </Link>
        </NavigationMenuLink>
    )
}

export default NavigationContainer;