import {create} from 'zustand'
import {PostCategory} from "@/types/Category";

interface PostCategoryStore {
    categories: PostCategory[];
    selectedCategory: string;
    setCategories: (categories: PostCategory[]) => void;
    setSelectedCategory: (category: string) => void;
    addCategories: (categories: PostCategory[]) => void;
}

export const usePostCategoryStore = create<PostCategoryStore>((set) => ({
    categories: [],
    selectedCategory: 'all',
    setCategories: (categories) => set({
        categories: categories.map(i => ({
            ...i, name: i.name.toLowerCase()}
        ))
    }),
    setSelectedCategory: (category) => set({selectedCategory: category}),
    addCategories: (newCategories) =>
        set((state) => ({
            categories: [...state.categories, ...newCategories]
        }))
}));