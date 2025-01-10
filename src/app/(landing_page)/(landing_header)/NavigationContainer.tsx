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
        <div>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>
                            Getting started
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className={'min-w-64'}>
                            <ItemComposition src={'#'} title={'How to use'}>
                                Guide you to use our project Horizon
                            </ItemComposition>
                            <NavigationMenuLink className={'w-full'}>
                                <>Login</>
                            </NavigationMenuLink>
                            <NavigationMenuLink className={'w-full'}>
                                <p>Sign up</p>
                            </NavigationMenuLink>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>
                            Discover
                        </NavigationMenuTrigger>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>
                            About Project
                        </NavigationMenuTrigger>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}


const ItemComposition = ({title, children, src}: { title: string, children: ReactNode, src: string }) => {
    return (
        <NavigationMenuLink asChild>
            <Link href={src} className={'max-w-max *:hover:bg-gray-300'}>
                <h1 className={'font-bold text-xl'}>{title}</h1>
                <p className={'text-sm font-light'}>{children}</p>
            </Link>
        </NavigationMenuLink>
    )
}

export default NavigationContainer;