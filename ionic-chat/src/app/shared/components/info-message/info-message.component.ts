import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'info-message',
  templateUrl: './info-message.component.html',
  styleUrls: ['./info-message.component.scss'],
})
export class InfoMessageComponent implements OnInit {
  @Input() type = Types.success
  @Input() title = "Completado!";
  @Input() accept = "Aceptar"
  @Output() clickEvent = new EventEmitter();
  buttonColors = {
    [Types.success]: "success",
    [Types.badRequest]: "danger"
  }


  colors = {
    [Types.success]: " rgb(111, 204, 111)",
    [Types.badRequest]: "#ef5350"
  }

  icons = {
    [Types.success]: "checkmark",
    [Types.badRequest]: "close"
  }

  buttonClicked() { this.clickEvent.emit() }

  constructor() { }

  ngOnInit(): void {
  }

}

export enum Types {
  success,
  badRequest
}

