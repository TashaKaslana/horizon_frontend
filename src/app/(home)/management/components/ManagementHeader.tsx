import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {usePostManagementStore} from "@/app/(home)/management/store/usePostManagementStore";
import {useDebouncedCallback} from "use-debounce";
import React from "react";
import {PostCategory, SortType} from "@/app/(home)/management/types/types";
import Link from "next/link";

export function ManagementHeader() {
    const {sortPosts, searchPosts, filterPosts} = usePostManagementStore()

    const filterOptions = [
        {label: "All", value: "all"},
        {label: "Entertainment", value: "entertainment"},
        {label: "Music", value: "music"},
        {label: "Education", value: "education"},
        {label: 'Gaming', value: "gaming"},
        {label: 'Tech', value: 'tech'}
    ]

    const sortOptions = [
        {label: 'Newest', value: 'newest',},
        {label: 'Oldest', value: 'oldest',},
        {label: "Popular", value: "popular"},
        {label: "Top Rated", value: "top_rated"},
        {label: "Top Commented", value: "top_commented"},
    ]

    const handleSortChange = (value: SortType) => {
        sortPosts(value)
    }

    const handleSearchChange = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value

        searchPosts(value)
    }, 400)

    const handleFilterChange = (value: PostCategory) => {
        filterPosts(value)
    }

    return (
        <header className={"border p-1 rounded"}>
            <section className={'lg:flex justify-between items-center sm:mb-2'}>
                <div>
                    <h1 className={"font-bold text-2xl"}>Post management</h1>
                    <p className={"font-light text-sm text-gray-500"}>Manage your posts content application.</p>
                </div>
                <div className={"flex gap-2"}>
                    <Select onValueChange={handleFilterChange}>
                        <SelectTrigger className={'w-32'}>
                            <SelectValue placeholder={'Filter'}/>
                        </SelectTrigger>
                        <SelectContent>
                            {filterOptions.map((item) => (
                                <SelectItem value={item.value} key={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button>
                        <Link href={'/uploads'}>
                            Upload new post
                        </Link>
                    </Button>
                </div>
            </section>

            <section className={'lg:flex lg:gap-4 sm:space-y-2'}>
                <Input placeholder={'Search post'} className={'flex-1'} onChange={handleSearchChange}/>
                <Select onValueChange={handleSortChange}>
                    <SelectTrigger className={'w-32'}>
                        <SelectValue placeholder={'Sort by'}/>
                    </SelectTrigger>

                    <SelectContent>
                        {sortOptions.map((sortOption) => (
                            <SelectItem value={sortOption.value} key={sortOption.value}>
                                {sortOption.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </section>
        </header>
    );
}