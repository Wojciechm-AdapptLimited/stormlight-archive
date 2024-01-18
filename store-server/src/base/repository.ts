import {Entity} from "@/base/entity.ts";

export interface IRepository<T extends Entity> {
    toArray(): Promise<T[]>;
    add(entity: T): Promise<T>;
    update(entity: T): Promise<T>;
    remove(entity: T): Promise<void>;
    find(entity: T): Promise<T | undefined>
    count(): Promise<number>;
    any(): Promise<boolean>;
}