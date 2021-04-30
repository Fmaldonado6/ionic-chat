export class User {
    private _id: string = ""
    username: string = ""
    email: string = ""
    password: string = ""
    get id() { return this._id }
    set id(val: string) { this._id = val }
}

export class Chat {
    private  _id: string = ""
    participants: string[] = []
    get id() { return this._id }
    set id(val: string) { this._id = val }
}

export class WebsocketMessage {
    type: number = WebsocketMessageTypes.connection
    message: string = ""
}

export class Message {
    private  _id: string = ""
    senderName: string = ""
    senderId: string = ""
    receiverId: string = ""
    chatId: string = ""
    message: string = ""
    messageType: number = MessageType.text

    get id() { return this._id }
    set id(val: string) { this._id = val }
}

export enum MessageType {
    text,
    image
}

export enum WebsocketMessageTypes {
    connection,
    send
}