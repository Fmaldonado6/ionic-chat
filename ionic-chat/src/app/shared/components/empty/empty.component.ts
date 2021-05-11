import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'empty',
  templateUrl: './empty.component.html',
  styleUrls: ['./empty.component.scss'],
})
export class EmptyComponent implements OnInit {

  @Input() icon = "help-circle"
  @Input() text = "No hay"

  constructor() { }

  ngOnInit() { }

}
