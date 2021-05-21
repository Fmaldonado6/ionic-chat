import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-option-tile',
  templateUrl: './option-tile.component.html',
  styleUrls: ['./option-tile.component.scss'],
})
export class OptionTileComponent implements OnInit {

  @Input() label: string
  @Input() icon: string

  constructor() { }

  ngOnInit() {}

}
