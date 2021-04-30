import { BaseController } from './../baseController';
import { Request, Response } from 'express';
import { chatRepository } from '../../../persistence/repositories/repositories';
import { Chat } from '../../../core/domain/models';


class ChatController extends BaseController {


    constructor() {
        super()
        this.config()
    }

    config() {
        this.router.get("/:id", (req, res) => this.getChats(req, res))
    }

    async getChats(req: Request, res: Response) {
        try {
            const id = req.params.id
            const chats = await chatRepository.getByUserId(id)

            res.status(200).json(chats)

        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    }


}

export const chatController = new ChatController()
