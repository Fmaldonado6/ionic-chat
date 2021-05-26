import { FullChatInfo, User, ChatResource } from './../../../core/domain/models';
import { messageRepository, usersRepository } from './../../../persistence/repositories/repositories';
import { BaseController, CustomRequest } from './../baseController';
import { Request, Response } from 'express';
import { chatRepository } from '../../../persistence/repositories/repositories';
import { Chat } from '../../../core/domain/models';


class ChatController extends BaseController {


    constructor() {
        super()
        this.config()
    }

    config() {
        this.router.get("/", this.verifyToken, (req, res) => this.getChats(req as CustomRequest, res))
        this.router.get("/:receiverId", this.verifyToken, (req, res) => this.getChatInfo(req as CustomRequest, res))

    }

    async getChats(req: CustomRequest, res: Response) {
        try {
            const id = req.id
            const chats = await chatRepository.getByUserId(id)
            const chatsWithInfo = []

            for (let chat of chats) {
                let user: User | null = null
                for (let participant of chat.participants) {
                    if (participant == id)
                        continue

                    user = await usersRepository.get(participant)

                    if (!user)
                        continue


                    user.password = ""
                }
                
                if (!user)
                    continue

                chat.chatName = user.username
                const chatResource = new ChatResource()
                const latest = await messageRepository.getLatestMessageFromChat(chat.id)
                chatResource.chatId = chat.id
                chatResource.receiverId = user.id
                chatResource.receiverName = user.username
                chatResource.latestMessage = latest
                chatsWithInfo.push(chatResource)
            }

            chatsWithInfo.sort((a, b) => new Date(b.latestMessage.created_at).getTime() - new Date(a.latestMessage.created_at).getTime())

            res.status(200).json(chatsWithInfo)

        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    }

    async getChatInfo(req: CustomRequest, res: Response) {
        try {

            const userId = req.id
            const receiverId = req.params.receiverId

            const fullChat = new FullChatInfo()
            const chat = await chatRepository.getByUsersId(userId, receiverId)
            const receiver = await usersRepository.get(receiverId)
            if (!receiver)
                return res.sendStatus(404)
            receiver.password = ""
            fullChat.receiver = receiver
            if (!chat)
                return res.status(200).json(fullChat)
            const messages = await messageRepository.getByChatId(chat.id)
            fullChat.chatId = chat.id
            fullChat.messages = messages

            return res.status(200).json(fullChat)

        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    }


}

export const chatController = new ChatController()
