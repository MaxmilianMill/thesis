export type WithStatus<K extends string, T> = {
    status: number;
} & Record<K, T>;