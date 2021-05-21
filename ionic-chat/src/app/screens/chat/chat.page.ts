import { UsersService } from 'src/app/services/users/users.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ChatsService } from 'src/app/services/chats/chats.service';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';
import { FullChatInfo, Message, MessageType, Status, WebsocketMessage, WebsocketMessageTypes } from 'src/app/models/models';
import { Subscription } from 'rxjs';
import { PhotoService } from 'src/app/services/photo/photo.service';
import { ViewWillEnter } from '@ionic/angular';

interface FormData {
  message: string
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements ViewWillEnter, OnDestroy, OnInit {
  private chatContainer: ElementRef;

  @ViewChild('chatContainer', { static: false }) set content(content: ElementRef) {
    if (content) {
      console.log(content)
      this.chatContainer = content;
    }
  }


  form: FormGroup
  receiverId: string
  chat: FullChatInfo = new FullChatInfo()
  senderId: string
  subscription: Subscription

  newChat = true

  Status = Status
  currentStatus = Status.loading
  constructor(
    private chatService: ChatsService,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private websocketService: WebsocketService,
    private photoService: PhotoService,
    private changeDetector: ChangeDetectorRef,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.subscription = this.websocketService.message.subscribe(e => {
      if (e) {
        this.chat.messages.push(e)
        this.scrollToBottom()
      }
    })
  }
  ionViewWillEnter(): void {
    this.websocketService.connect()

    this.form = new FormGroup({
      message: new FormControl('')
    })

    this.senderId = this.usersService.loggedUser.id

    this.receiverId = this.route.snapshot.params.id
    this.chatService.getChatInfo(this.receiverId).subscribe(e => {
      this.newChat = e.chatId == ""
      this.chat = e
      this.currentStatus = Status.loaded
      this.changeDetector.detectChanges()
      this.scrollToBottom()
    })


  }
  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe()
  }


  goBack() {
    this.router.navigate(["/main"])
  }

  scrollToBottom() {
    if (this.chatContainer)
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight
  }

  fromToMessage(value: FormData, type = MessageType.image) {
    this.form.patchValue({ message: "" })
    const message = new Message()
    message.message = value.message
    message.receiverId = this.receiverId
    message.senderId = this.usersService.loggedUser.id
    this.sendMessage(message)
  }

  sendMessage(message: Message) {
    const websocketMessage = new WebsocketMessage()
    websocketMessage.type = WebsocketMessageTypes.send
    websocketMessage.message = JSON.stringify(message)
    this.websocketService.sendMessage(websocketMessage)
    this.chat.messages.push(message)
    this.changeDetector.detectChanges()
    this.scrollToBottom()

  }



  async takePhoto() {
    const photo = await this.photoService.addNewToGallery()
    const message = new Message()
    message.message = photo.base64String
    message.receiverId = this.receiverId
    message.messageType = MessageType.image
    message.senderId = this.usersService.loggedUser.id
    this.sendMessage(message)
  }


}
