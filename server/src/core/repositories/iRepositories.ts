import { Chat, Message, User } from './../domain/models';
import { IRepository } from './iBaseRepository';
export interface IChatRepository extends IRepository<Chat> {
    getByUserId(id: string): Promise<Chat[]>
    getByUsersId(senderId: string, receiverId: string): Promise<Chat>
}

export interface IMessageRepository extends IRepository<Message> {
    getByChatId(id: string): Promise<Message[]>
}

export interface IUserRepository extends IRepository<User> {
    getByEmail(email: string): Promise<User>
}

