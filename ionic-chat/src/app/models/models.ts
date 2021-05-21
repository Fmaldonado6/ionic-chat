export class User {
    private _id: string = ""
    username: string = ""
    email: string = ""
    password: string = ""
    get id() { return this._id }
    set id(val: string) { this._id = val }
}

export class Passwords {
    oldPassword: string = ''
    newPassword: string = ''
}

export class ChatResource {
    chatId: string = ""
    receiverId: string = ""
    receiverName: string = ""
    latestMessage: Message = new Message()
    newMessages = 0
}

export class Chat {
    private _id: string = ""
    chatName: string = ""
    participants: string[] = []
    get id() { return this._id }
    set id(val: string) { this._id = val }
}

export class WebsocketMessage {
    type: number = WebsocketMessageTypes.connection
    message: string = ""
}

export class Message {
    private _id: string = ""
    senderName: string = ""
    senderId: string = ""
    receiverId: string = ""
    chatId: string = ""
    message: string = ""
    messageType: number = MessageType.text

    get id() { return this._id }
    set id(val: string) { this._id = val }
}

export class FullChatInfo {
    chatId: string = ""
    receiver?: User
    messages: Message[] = []
}

export enum MessageType {
    text,
    image
}

export enum WebsocketMessageTypes {
    connection,
    send
}

export enum Status {
    loading,
    loaded,
    error,
    success,
    empty
}
