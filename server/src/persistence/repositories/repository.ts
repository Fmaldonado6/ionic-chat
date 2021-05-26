import { Model } from 'mongoose';
import { IRepository } from './../../core/repositories/iBaseRepository';

export abstract class Repository<T extends object> implements IRepository<T> {

    async add(object: T): Promise<T> {
        let objectAny = object as any
        delete objectAny._id
        return await this.getModel().create(objectAny);
    }

    async get(id: string): Promise<T | null> {
        let object = (await this.getModel().findById(id));
        if (!object)
            return null
        return object.toObject() as T;
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