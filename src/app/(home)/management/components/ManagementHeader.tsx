import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {usePostManagementStore} from "@/app/(home)/management/store/usePostManagementStore";
import {useDebouncedCallback} from "use-debounce";
import React from "react";
import {PostCategory, SortType} from "@/app/(home)/management/types/types";
import Link from "next/link";
import {useTranslations} from "next-intl";
import {useQuery} from "@tanstack/react-query";
import {getPostCategories} from "@/api/postApi";

export function ManagementHeader() {
    const t = useTranslations('Home.management');
    const {sortPosts, searchPosts, filterPosts} = usePostManagementStore()

    const {data: categoriesData} = useQuery({
        queryKey: ['management-categories'],
        queryFn: () => getPostCategories({page: 0, size: 20})
    })

    const categories = categoriesData?.data ?? []

    const filterOptions = [
        {label: t('filterOptions.all'), value: 'all'},
        ...categories.map((c) => ({label: c.name, value: c.name.toLowerCase()}))
    ]

    const sortOptions = [
        {label: t('sortOptions.newest'), value: 'newest'},
        {label: t('sortOptions.oldest'), value: 'oldest'},
        {label: t('sortOptions.popular'), value: 'popular'},
        {label: t('sortOptions.topRated'), value: 'top_rated'},
        {label: t('sortOptions.topCommented'), value: 'top_commented'},
    ]

    const [sortType, setSortType] = React.useState<SortType>('newest')
    
    const handleSortChange = (value: SortType) => {
        sortPosts(value)
        setSortType(value)
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
                    <h1 className={"font-bold text-2xl"}>{t('title')}</h1>
                    <p className={"font-light text-sm text-gray-500"}>{t('description')}</p>
                </div>
                <div className={"flex gap-2"}>
                    <Select onValueChange={handleFilterChange}>
                        <SelectTrigger className={'w-32'}>
                            <SelectValue placeholder={t('filter')}/>
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
                            {t('uploadButton')}
                        </Link>
                    </Button>
                </div>
            </section>

            <section className={'lg:flex lg:gap-2 sm:space-y-2'}>
                <Input placeholder={t('searchPlaceholder')} className={'flex-1'} onChange={handleSearchChange}/>
                <Select value={sortType} onValueChange={handleSortChange}>
                    <SelectTrigger className={'w-38'}>
                        <SelectValue placeholder={t('sortBy')}/>
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