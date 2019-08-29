export interface IPortalStorage {
    name(): string;
    set(key: string, item: string): void;
    get(key: string): string;
    reset(key: string): void;
    remove(key: string): void;
}
