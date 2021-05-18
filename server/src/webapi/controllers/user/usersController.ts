import { usersRepository, chatRepository } from './../../../persistence/repositories/repositories';
import { BaseController, CustomRequest } from './../baseController';
import { Request, Response } from 'express';
import { User } from '../../../core/domain/models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

class UsersController extends BaseController {
    constructor() {
        super()
        this.config()
    }

    config() {
        this.router.post("/", (req, res) => this.createUser(req, res))
        this.router.get("/", this.verifyToken, (req, res) => this.getUsers(req, res))
        this.router.post("/auth", (req, res) => this.authUser(req, res))
        this.router.put("/", this.verifyToken, (req: Request, res) => this.updateUser(req as CustomRequest, res))
        this.router.put("/password", this.verifyToken, (req: Request, res) => this.updateUserPassword(req as CustomRequest, res))

    }

    async getUsers(req: any, res: Response) {
        try {
            const tokenId = req.id

            const users = await usersRepository.findAll()
            const chats = await chatRepository.getByUserId(tokenId)

            const chatsWith: string[] = []

            chats.forEach(e => {
                const id = e.participants.filter(p => p != tokenId).shift() as string
                chatsWith.push(id)
            })
            const filterUsers = users.filter(e => !chatsWith.includes(e.id) && e.id != tokenId)

            res.status(200).json(filterUsers)

        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    }

    async createUser(req: Request, res: Response) {
        try {
            const user = req.body as User

            const exists = await usersRepository.getByEmail(user.email)

            if (exists)
                return res.sendStatus(409)

            const salt = await bcrypt.genSalt()

            user.password = await bcrypt.hash(user.password, salt)

            await usersRepository.add(user)

            res.status(200).json({})

        } catch (error) {
            res.sendStatus(500)

        }

    }

    async authUser(req: Request, res: Response) {
        try {
            const user = req.body as User

            const savedUser = await usersRepository.getByEmail(user.email)

            if (!savedUser)
                return res.sendStatus(404)

            const correct = await bcrypt.compare(user.password, savedUser.password)

            if (!correct)
                return res.sendStatus(403)

            let token = jwt.sign(
                {
                    username: user.username,
                    email: user.email,
                    id: savedUser.id
                },
                'chunchunmaru')

            res.status(200).json(token)

        } catch (error) {
            res.sendStatus(500)
            console.log(error)
        }
    }

    async updateUserPassword(req: CustomRequest, res: Response) {
        try {
            const tokenId = req.id
            const newPassword = req.body.newPassword
            const oldPassword = req.body.oldPassword

            const oldUserData = await usersRepository.get(tokenId)

            const matches = await bcrypt.compare(oldPassword, oldUserData.password)

            if (!matches)
                return res.sendStatus(403)

            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(newPassword, oldPassword)

            oldUserData.password = hashedPassword

            await usersRepository.update(oldUserData)
            oldUserData.password = ""
            return res.status(200).json(oldUserData)

        } catch (error) {

        }
    }


    async updateUser(req: CustomRequest, res: Response) {
        try {


            const tokenId = req.id
            const user = req.body as User

            const oldUserData = await usersRepository.get(tokenId)

            if (!user.username || user.username == "")
                user.username = oldUserData.username

            if (!user.email || user.email == "")
                user.email = oldUserData.email
            else {
                const exists = await usersRepository.getByEmail(user.email)

                if (exists && exists.id != tokenId)
                    return res.sendStatus(409)
            }

            user.password = oldUserData.password

            await usersRepository.update(user)


            return res.status(200).json(user)

        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }

    }
}

export const userController = new UsersController()
