import { FullChatInfo, User } from './../../../core/domain/models';
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
                let user: User = new User()
                for (let participant of chat.participants) {
                    if (participant == id)
                        continue

                    user = await usersRepository.get(participant)
                    user.password = ""
                }
                chat.chatName = user.username
                const fullInfo = new FullChatInfo()
                fullInfo.chatId = chat.id
                fullInfo.receiver = user
                chatsWithInfo.push(fullInfo)
            }

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

            const chat = await chatRepository.getByUsersId(userId, receiverId)
            const messages = await messageRepository.getByChatId(chat.id)
            const receiver = await usersRepository.get(receiverId)
            receiver.password = ""

            const fullChat = new FullChatInfo()

            fullChat.chatId = chat.id
            fullChat.messages = messages
            fullChat.receiver = receiver

            return res.status(200).json(fullChat)

        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    }


}

export const chatController = new ChatController()
