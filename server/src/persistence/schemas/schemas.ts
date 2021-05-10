import { model, Schema } from "mongoose";

const ChatSchema = new Schema({
    participants: [String]
}).set('toObject', { getters: true })

const MessageSchema = new Schema({
    senderName: String,
    senderId: String,
    chatId: String,
    message: String,
    messageType: Number
}).set('toObject', { getters: true })

const UserSchema = new Schema({
    username: String,
    email: String,
    password: String
}).set('toObject', { getters: true })

export const ChatModel = model('Chat', ChatSchema)
export const MessageModel = model('Message', MessageSchema)
export const UserModel = model('User', UserSchema)
