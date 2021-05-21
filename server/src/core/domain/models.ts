export class User {
    _id: string = ""
    username: string = ""
    email: string = ""
    password: string = ""
    get id() { return this._id }
    set id(val: string) { this._id = val }
}

export class Chat {
    _id: string = ""
    chatName: string = ""
    participants: string[] = []
    get id() { return this._id }
    set id(val: string) { this._id = val }
}

export class FullChatInfo {
    chatId: string = ""
    receiver?: User
    messages: Message[] = []
}

export class ChatResource {
    chatId: string = ""
    receiverId: string = ""
    receiverName: string = ""
    latestMessage: Message = new Message()
}

export class WebsocketMessage {
    type: number = WebsocketMessageTypes.connection
    message: string = ""
}

export class Message {
    _id: string = ""
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