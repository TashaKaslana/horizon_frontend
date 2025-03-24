export interface Post {
    id: string,
    title: string,
    description: string,
    src: string,
    author: string,
    category: PostCategory,
    tags?: string[],
    view: number,
    timestamp: string,
    likes: number,
    comments: number,
}

export type SortType = 'newest' | 'oldest' | 'popular' | 'top-rated' | 'top-commented'

export type PostCategory = "entertainment" | "music" | "education" | "gaming" | "tech"