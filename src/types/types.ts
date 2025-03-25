export interface ConfigType<T = ValueConfigType> extends ConfigOption<T> {
    title: string;
    description: string;
}

export type ConfigOption<T = ValueConfigType> = {
    key: string;
    value: T;
};

type ValueConfigType = boolean | string

export interface Post {
    id: string;
    title: string;
    description: string;
    src: string;
    avatar: string;
    author: string;
    username: string;
    category: string;
    tags: string[];
    view: number;
    timestamp: string;
    likes: number;
    comments: number;
}