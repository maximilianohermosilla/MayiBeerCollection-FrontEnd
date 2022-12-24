import { Component, OnInit, ViewChild } from '@angular/core';
import { PaisService } from 'src/app/services/pais.service';
import {MatTableModule, MatTableDataSource, MatTable} from '@angular/material/table';

@Component({
  selector: 'app-pais',
  templateUrl: './pais.component.html',
  styleUrls: ['./pais.component.css']
})
export class PaisComponent implements OnInit{
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
