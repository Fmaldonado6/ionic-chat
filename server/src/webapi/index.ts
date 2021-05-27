import { messageController } from './controllers/messages/messageController';
import { chatController } from './controllers/chat/chatController';
import { userController } from './controllers/user/usersController';
import { webSocketController } from './controllers/websocket/websocketController';
import { mongodbConnection } from './../persistence/database';
import express, { Application } from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import morgan from "morgan";
import expressWs from 'express-ws'

const PORT = 'port'

class Server {
    public app: Application

    constructor() {
        this.app = expressWs(express()).app
        this.config()
        this.routes()
    }

    config() {
        dotenv.config();
        this.app.set(PORT, process.env.PORT);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        mongodbConnection.connect()
    }

    routes() {
        this.app.use('/chat', chatController.router);
        this.app.use('/message', messageController.router);
        this.app.use('/users', userController.router);
        this.app.use('/websocket', webSocketController.router);

    }

    start() {
        const port = this.app.get(PORT)
        this.app.listen(port, () => {
            console.log("App listening on port " + port)
        })
    }

}

const server = new Server()
server.start()