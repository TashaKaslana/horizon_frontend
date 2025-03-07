import {
    Compass, DoorOpen,
    HistoryIcon,
    House,
    MailboxIcon,
    MoreHorizontal,
    PackageSearch, Settings, SquareUserRound,
    Upload,
    User,
    Users
} from "lucide-react";

export const navigationData = [
    {title: 'For you', icon: <House/>, href: '/for-you'},
    {title: 'Discover', icon: <Compass/>, href: '/discover'},
    {title: 'Management', icon: <PackageSearch/>, href: '/management'},
    {title: 'Uploads', icon: <Upload/>, href: '/uploads'},
    {title: 'Friends', icon: <Users/>, href: '/friends'},
    {title: 'Following', icon: <User/>, href: '/following'},
    {title: 'Notifications', icon: <MailboxIcon/>, href: '/notifications'},
    {title: 'More', icon: <MoreHorizontal/>, href: '/more'},
]

export const navigationUserData = [
    {title: 'History', icon: <HistoryIcon/>, href: '/history'},
    {title: 'Profile', icon: <SquareUserRound/>, href: '/profile'},
    {title: 'Settings', icon: <Settings/>, href: '/settings'},
    {title: 'Logout', icon: <DoorOpen/>, href: '/logout'},
]