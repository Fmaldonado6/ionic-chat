import { usersRepository } from './../../../persistence/repositories/repositories';
import { BaseController } from './../baseController';
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
        this.router.put("/:id", this.verifyToken, (req: Request, res) => this.updateUser(req, res))

    }

    async getUsers(req: any, res: Response) {
        try {
            const tokenId = req.id


            const users = await usersRepository.findAll()

            const filterUsers = users.filter(e => e.id != tokenId)

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
                return res.sendStatus(400)

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

    async updateUser(req: any, res: Response) {
        try {

            const paramsId = req.params.id

            const tokenId = req.id

            if (paramsId != tokenId)
                return res.sendStatus(403)


            return res.sendStatus(200)
        } catch (error) {

        }

    }
}

export const userController = new UsersController()
