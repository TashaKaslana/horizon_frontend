'use client'

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import React from "react";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {useNavigationData} from "@/app/(home)/hooks/use-navigation-data";

type SearchBarProps = {
    open?: boolean;
    setOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SearchBar = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <SearchBarTrigger setOpenChange={setOpen}/>
            <SearchBarContent open={open} setOpenChange={setOpen}/>
        </>
    );
};

const SearchBarTrigger = ({setOpenChange}: SearchBarProps) => {
    return (
        <Input placeholder={'Search...'}
               onClick={() => setOpenChange(true)}
        />
    )
}

const SearchBarContent = ({open, setOpenChange}: SearchBarProps) => {
    const navigationData = useNavigationData()

    return (
        <CommandDialog open={open} onOpenChange={setOpenChange}>
            <CommandInput placeholder="Type a command or search..."/>
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="For You">
                    {navigationData.map((item) => (
                        <CommandItemLink key={item.title} {...item}/>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}

type CommandItemLinkProps = {
    title: string;
    icon?: React.ReactNode;
    href: string;
}

const CommandItemLink = ({title, icon, href}: CommandItemLinkProps) => {
    return (
        <Link href={href} className={'cursor-pointer'}>
            <CommandItem>
                {icon}
                {title}
            </CommandItem>
        </Link>
    )
}