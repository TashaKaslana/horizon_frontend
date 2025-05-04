import {FollowCardProps} from "@/app/(home)/following/types/type";

export const filterUsers = (users: FollowCardProps[],
                            filterString: string) => {
    const trimmedFilter = filterString.trim();
    if (!trimmedFilter) return users;

    console.log(filterString)

    if (trimmedFilter.at(0) === '@' && trimmedFilter.length > 1) {
        // remove @ from filter
        const newFilterString = trimmedFilter.substring(1)

        return users.filter(card => card.user.username.toLowerCase().includes(newFilterString.toLowerCase()))
    }

    return users.filter(card =>
        card.user.displayName.toLowerCase().includes(trimmedFilter.toLowerCase()) ||
        card.user.username.toLowerCase().includes(trimmedFilter.toLowerCase())
    )
}


// export const sortUsers = (users: UserCardProps[], sortOption: "newest" | "oldest") => {
//     return users.sort((a, b) => a.)
// }