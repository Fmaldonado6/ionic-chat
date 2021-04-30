import express, { Router, Request } from "express";
import jwt from 'jsonwebtoken'
import expressWs from 'express-ws';

let instance = expressWs(express()).app
export class BaseController {
    public router: expressWs.Router = Router();

    async verifyToken(req: any, res: any, next: any) {
        try {
            if (!req.headers.authorization)
                return res.status(401).send('Unauhtorized Request');

            let token = req.headers.authorization.split(' ')[1];

            if (token === 'null')
                return res.status(401).send('Unauhtorized Request');


            const payload: any = jwt.verify(token, 'chunchunmaru');

            if (!payload)
                return res.status(401).send('Unauhtorized Request');

            req.username = payload.username;
            req.id = payload.id

            next();

        } catch (e) {
            return res.status(401).send('Unauhtorized Request');
        }
    }

}