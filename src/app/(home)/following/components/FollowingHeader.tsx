'use client'

import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useDebouncedCallback} from "use-debounce";
import {filterUsers, sortUsers} from "@/app/(home)/following/libs/utils/filter_sort_user";
import useFollowingStore from "@/app/(home)/following/store/useFollowingStore";
import React, {useRef} from "react";
import { useTranslations } from "next-intl";

export const FollowingHeader = () => {
    const t = useTranslations('Home.following');
    const {initialFollowers, initialFollowing, following, followers, setFollowers, setFollowing} = useFollowingStore();
    const [tab, setTab] = React.useState("following");
    const inputRef = useRef<HTMLInputElement>(null)

    const handleChange = useDebouncedCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const filterString = event.target.value;

        if (tab === "following") {
            setFollowing(filterUsers(following, filterString));
        } else {
            setFollowers(filterUsers(followers, filterString));
        }
    }, 400);

    const handleChangeTab = (tab: string) => {
        setTab(tab)

        if (tab === "following") {
            setFollowing(initialFollowing)
        } else {
            setFollowers(initialFollowers)
        }

        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }

    const handleSort = (sortOption: "newest" | "oldest") => {
        if (tab === "following") {
            setFollowing(sortUsers(following, sortOption));
        } else {
            setFollowers(sortUsers(followers, sortOption));
        }
    }

    return (
        <header className="border rounded p-1 flex">
            <section className="flex-1">
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    {t(`tabs.${tab}`)}
                </h3>
                <p className="text-sm font-medium leading-none italic text-zinc-500">
                    {t(`stats.${tab}Count`, { count: tab === 'following' ? following.length : followers.length })}
                </p>
            </section>
            <section className="flex items-center gap-2 w-1/2">
                <TabsList>
                    <TabsTrigger value="following"
                                 onClick={() => handleChangeTab("following")}>
                        {t('tabs.following')}
                    </TabsTrigger>
                    <TabsTrigger value="followers"
                                 onClick={() => handleChangeTab("followers")}>
                        {t('tabs.followers')}
                    </TabsTrigger>
                </TabsList>
                <Input
                    type="text"
                    placeholder={t('search.placeholder')}
                    className="border w-full py-2 px-3 text-sm focus:outline-none"
                    onChange={handleChange}
                    ref={inputRef}
                />
                <Select>
                    <SelectTrigger defaultValue="recent">
                        <SelectValue placeholder={t('filter.recent')}/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest" onClick={() => handleSort('newest')}>{t('filter.recent')}</SelectItem>
                        <SelectItem value="oldest" onClick={() => handleSort('oldest')}>{t('filter.all')}</SelectItem>
                    </SelectContent>
                </Select>
            </section>
        </header>
    );
};