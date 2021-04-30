import { messageRepository } from './../../../persistence/repositories/repositories';
import { Request, Response } from 'express';
import { BaseController } from './../baseController';
class MessageController extends BaseController {
    constructor() {
        super()
        this.config()
    }

    config() {
        this.router.get("/:id", (req, res) => this.getMessages(req, res))

    }

    async getMessages(req: Request, res: Response) {
        try {
            const id = req.params.id
            const messages = await messageRepository.getByChatId(id)
            res.status(200).json(messages)
        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    }
}

export const messageController = new MessageController()