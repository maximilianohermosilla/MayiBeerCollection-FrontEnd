import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-banner-title',
  templateUrl: './banner-title.component.html',
  styleUrls: ['./banner-title.component.css']
})
export class BannerTitleComponent {
  @Input() text: string="";
  @Input() icon: string="";
  @Output() btnAdd = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onClick(){
    this.btnAdd.emit();
  }

}
