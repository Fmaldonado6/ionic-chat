import { MessageModel, UserModel } from './../schemas/schemas';
import { Model } from 'mongoose';
import { ChatModel } from '../schemas/schemas';
import { Chat, Message, User } from './../../core/domain/models';
import { IChatRepository, IMessageRepository, IUserRepository } from './../../core/repositories/iRepositories';
import { Repository } from "./repository";

class ChatRepository extends Repository<Chat> implements IChatRepository {
    async getByUserId(id: string): Promise<Chat[]> {
        return this.getModel().find({ participants: id });
    }
    async getByUsersId(senderId: string, receiverId: string): Promise<Chat> {
        return this.getModel().findOne({ participants: { $all: [senderId, receiverId] } });

    }


    getModel(): Model<any> {
        return ChatModel;
    }
}

class MessageRepository extends Repository<Message> implements IMessageRepository {
    async getLatestMessageFromChat(id: string): Promise<Message> {
        return this.getModel().findOne({ chatId: id, _id: -1 })
    }
    async getByChatId(id: string): Promise<Message[]> {
        return this.getModel().find({ chatId: id });
    }
    getModel(): Model<any> {
        return MessageModel;
    }
}

class UserRepository extends Repository<User> implements IUserRepository {
    async getByEmail(email: string): Promise<User> {
        return this.getModel().findOne({ email: email });
    }
    getModel(): Model<any> {
        return UserModel;
    }
}



export const usersRepository = new UserRepository()
export const chatRepository = new ChatRepository()
export const messageRepository = new MessageRepository()
