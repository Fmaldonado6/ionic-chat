import { Model } from "mongoose";

export interface IRepository<T extends any> {

    get(id: string): Promise<T | null>;

    add(object: T): Promise<T>;

    findAll(): Promise<T[]>;

    update(object: T): Promise<T>;

    delete(id: string): Promise<T>;

    getModel(): Model<any>;

}