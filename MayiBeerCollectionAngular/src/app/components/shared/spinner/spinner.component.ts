import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {
  spinner = true;
  text: string = "";
  constructor() {}

  ngOnInit(): void{
    this.text = "Cargando...";
  }

}
