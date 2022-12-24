import { Component, OnInit, ViewChild } from '@angular/core';
import { PaisService } from 'src/app/services/pais.service';
import {MatTableModule, MatTableDataSource, MatTable} from '@angular/material/table';


@Component({
  selector: 'app-grilla-pais',
  templateUrl: './grilla-pais.component.html',
  styleUrls: ['./grilla-pais.component.css']
})
export class GrillaPaisComponent {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  dataSource: any;
  nombreColumnas: string[] = ["nombre", "acciones"];

  constructor(private servicioPais: PaisService) { }

  ngOnInit(): void {
    this.servicioPais.GetAll().subscribe((rta: any[]) => {
      this.dataSource = new MatTableDataSource<any[]>(rta);
      this.dataSource = rta;
      console.log(rta);
    })
  }

  ver(db: any) {}
}
