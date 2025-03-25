import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useDiscoverStore} from "@/app/(home)/discover/store/useDiscoverPostStore";

export const DiscoverHeader = ({triggers} : {triggers: string[]}) => {
    const viewOptions = ['Popular', 'Recent', 'Rating']
    const {sortPosts} = useDiscoverStore()

    const handleValueChange = (value: 'popular' | 'rating' | 'recent') => {
        sortPosts(value)
    }

    return <header className={'space-y-3 border p-1 rounded sticky'}>
        <div className={'flex justify-between'}>
            <div>
                <h1 className={'p-0 m-0 text-3xl font-semibold text-gray-900 dark:text-white/70'}>Discover</h1>
                <p className={'text-sm font-light text-zinc-600'}>Display all video by category</p>
            </div>

            <Select defaultValue={viewOptions[0].toLowerCase()} onValueChange={handleValueChange}>
                <SelectTrigger className={'w-32'}>
                    <SelectValue placeholder={viewOptions[0]}/>
                </SelectTrigger>
                <SelectContent>
                    {viewOptions.map((viewOption, index) =>
                        <SelectItem value={viewOption.toLowerCase()} key={index}>
                            {viewOption}
                        </SelectItem>
                    )}
                </SelectContent>
            </Select>
        </div>
        <TabsList className={'w-full'}>
            {triggers.map((trigger, index) =>
                <TabsTrigger value={trigger} key={index}>
                    {trigger}
                </TabsTrigger>
            )}
        </TabsList>
    </header>;
}