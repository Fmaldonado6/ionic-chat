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
    //Nos suscribimos a los mensajes entrantes
    this.subscription = this.websocketService.message.subscribe(e => {
      //Si el mensaje pertenece al chat lo agregamos a la lista
      if (e && e.senderId == this.receiverId) {
        this.chat.messages.push(e)
        this.scrollToBottom()
      }
    })
  }

  ionViewWillEnter(): void {
    //Se conecta al websocket
    this.websocketService.connect()

    //Se inicia el form
    this.form = new FormGroup({
      message: new FormControl('')
    })

    //Se establecen los id de los participantes
    this.senderId = this.usersService.loggedUser.id
    this.receiverId = this.route.snapshot.params.id

    //Obtenemos la información completa del chat
    this.chatService.getChatInfo(this.receiverId).subscribe(e => {
      //Verificamos si es un chat nuevo o ya existente
      this.newChat = e.chatId == ""
      //Guardamos la informacion del chat
      this.chat = e
      this.currentStatus = Status.loaded
      this.changeDetector.detectChanges()
      this.scrollToBottom()
    })


  }
  //Se desuscribe de los mensajes entrantes
  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe()
  }


  //Se regresa a la pagina principal
  goBack() {
    this.router.navigate(["/main"])
  }

  //Scroll hasta el final de la sección de mensajes
  scrollToBottom() {
    if (this.chatContainer) {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight
    }
  }

  //Mandamos mensaje de texto
  formMessage(value: FormData) {
    //Reiniciamos el formulario
    this.form.patchValue({ message: "" })
    //Creamos mensaje nuevo
    const message = new Message()
    //Establecemos el mensaje
    message.message = value.message
    //Establecemos el nombre del que lo envia
    message.senderName = this.usersService.loggedUser.username
    //Establecemos los id de los participantes
    message.receiverId = this.receiverId
    message.senderId = this.usersService.loggedUser.id
    //Enviamos el mensaje
    this.sendMessage(message)
  }

  //Enviar mensajes por el websocket
  sendMessage(message: Message) {
    //Creamos un nuevo mensaje de websocket
    const websocketMessage = new WebsocketMessage()
    //Especificamos el tipo de mensaje
    websocketMessage.type = WebsocketMessageTypes.send
    //Convertimos a string el mensaje
    websocketMessage.message = JSON.stringify(message)
    //Convertimos a string el mensaje
    this.websocketService.sendMessage(websocketMessage)
    //Agregamos el mensaje a la lista de mensajes
    this.chat.messages.push(message)
    this.changeDetector.detectChanges()
    this.scrollToBottom()

  }


  //Función para tomor fotos
  async takePhoto() {
    //Espera a que el service tome la foto
    const photo = await this.photoService.addNewToGallery()
    //Creamos un mensaje nuevo
    const message = new Message()
    //Establecemos el mensaje como el string de la foto
    message.message = photo.base64String
    //Cambiamos el tipo a imagen
    message.messageType = MessageType.image
    //Establecemos los id de los participantes
    message.receiverId = this.receiverId
    message.senderId = this.usersService.loggedUser.id
    //Establecemos el nombre de quien lo envia
    message.senderName = this.usersService.loggedUser.username
    //Enviamos el mensaje
    this.sendMessage(message)
  }


}
