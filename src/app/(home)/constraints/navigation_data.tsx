import {
    Compass, House,
    MailboxIcon,
    PackageSearch, Upload,
    User,
} from "lucide-react";

export const navigationData = [
    {title: 'For you', icon: <House/>, href: '/foryou'},
    {title: 'Discover', icon: <Compass/>, href: '/discover'},
    {title: 'Management', icon: <PackageSearch/>, href: '/management'},
    {title: 'Uploads', icon: <Upload/>, href: '/uploads'},
    // {title: 'Friends', icon: <Users/>, href: '/friends'},
    {title: 'Following', icon: <User/>, href: '/following'},
    {title: 'Notifications', icon: <MailboxIcon/>, href: '/notifications'},
    // {title: 'More', icon: <MoreHorizontal/>, href: '/more'},
]