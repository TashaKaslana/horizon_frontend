import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export const DiscoverHeader = () => {
    const viewOptions = ['Popular', 'Recent', 'Rating']

    return <header className={'px-7 flex justify-between'}>
        <h1 className={'p-0 m-0 text-3xl font-semibold text-gray-900'}>Discover</h1>
        <Select defaultValue={viewOptions[0]}>
            <SelectTrigger>
                <SelectValue placeholder={viewOptions[0]}/>
            </SelectTrigger>
            <SelectContent>
                {viewOptions.map((viewOption, index) =>
                    <SelectItem value={viewOption} key={index}>
                        {viewOption}
                    </SelectItem>
                )}
            </SelectContent>
        </Select>
    </header>;
}