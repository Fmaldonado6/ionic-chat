import { Model } from 'mongoose';
import { IRepository } from './../../core/repositories/iBaseRepository';

export abstract class Repository<T extends object> implements IRepository<T> {

    async add(object: T): Promise<T> {
        let objectAny = object as any
        delete objectAny._id
        return await this.getModel().create(objectAny);
    }

    async get(id: string): Promise<T> {
        let object: T = (await this.getModel().findById(id)).toObject() as T;
        return object;
    }
    async findAll(): Promise<T[]> {
        return (await this.getModel().find()).map(e => e.toObject());
    }
    async update(object: T): Promise<T> {
        let objectAny = object as any;
        let id = objectAny._id
        delete objectAny._id
        return this.getModel().findByIdAndUpdate(id, objectAny) as T;

    }
    async delete(id: string): Promise<T> {
        return this.getModel().findByIdAndDelete(id);

    }

    abstract getModel(): Model<any>;

}