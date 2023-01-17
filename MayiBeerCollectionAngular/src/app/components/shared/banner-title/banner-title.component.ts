import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-banner-title',
  templateUrl: './banner-title.component.html',
  styleUrls: ['./banner-title.component.css']
})
export class BannerTitleComponent {
  @Input() text: string="";
  @Input() icon: string="";
  @Output() btnAdd = new EventEmitter();
  isAdmin: boolean = false;

  constructor(private tokenService: TokenService) { }

  ngOnInit(): void {
    this.isAdmin  = (this.tokenService.getToken())? true: false;
  }

  onClick(){
    this.btnAdd.emit();
  }

}
