export interface ConfigType<T = ValueConfigType> extends ConfigOption<T> {
    title: string;
    description: string;
}

export type ConfigOption<T = ValueConfigType> = {
    key: string;
    value: T;
};

type ValueConfigType = boolean | string