import { chatRepository, messageRepository } from './../../../persistence/repositories/repositories';
import { Message, WebsocketMessage, WebsocketMessageTypes, Chat } from './../../../core/domain/models';
import { BaseController } from './../baseController';
class WebsocketController extends BaseController {

    users = new Map<string, any>();

    constructor() {
        super();
        this.config();
    }

    config() {

        this.router.ws('/message', (ws, req) => this.sendMessage(ws, req))

    }

    async sendMessage(ws: any, req: any) {

        ws.on('message', async (msg: string) => {
            const wsMessage = JSON.parse(msg) as WebsocketMessage
            if (wsMessage.type == WebsocketMessageTypes.connection)
            return this.users.set(wsMessage.message, ws)
            
            const message = JSON.parse(wsMessage.message) as Message
            console.log(message.receiverId)
            console.log(message.senderId)

            let chat = await chatRepository.getByUsersId(message.senderId, message.receiverId)

            if (!chat) {
                const newChat = new Chat()
                newChat.participants = [message.receiverId, message.senderId]
                console.log(newChat)
                chat = await chatRepository.add(newChat)
                console.log(chat)

            }

            message.chatId = chat.id

            await messageRepository.add(message)

            const user = this.users.get(message.receiverId)
            if (user)
                user.send(JSON.stringify(message))

        })



        ws.on('close', () => {
            this.users.delete(ws.id)
        })
    }

}

export const webSocketController = new WebsocketController()
