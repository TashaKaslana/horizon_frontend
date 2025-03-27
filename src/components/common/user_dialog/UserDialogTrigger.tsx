import {JSX} from "react";

interface UserDialogTriggerProps {
    item: { icon: JSX.Element; title: string }
}

export const UserDialogTrigger = ({item}: UserDialogTriggerProps) => {
    return <div
        className={'group box-border flex p-1 gap-2 justify-start border border-transparent ' +
            'hover:border-gray-300 items-center transition-colors duration-500 rounded'}
    >
        <span
            className={'text-zinc-500 group-hover:text-black transition-colors duration-500'}>{item?.icon}</span>
        <p className={'text-sm font-extralight'}>{item?.title}</p>
    </div>;
}