import { Component, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CervezaService } from 'src/app/services/cerveza.service';

@Component({
  selector: 'app-grilla-cerveza',
  templateUrl: './grilla-cerveza.component.html',
  styleUrls: ['./grilla-cerveza.component.css']
})
export class GrillaCervezaComponent {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  dataSource: any;
  nombreColumnas: string[] = ["nombre", "acciones"];

  constructor(private servicioCerveza: CervezaService) { }

  ngOnInit(): void {
    this.servicioCerveza.GetAll().subscribe((rta: any[]) => {
      this.dataSource = new MatTableDataSource<any[]>(rta);
      this.dataSource = rta;
      console.log(rta);
    })
  }

  ver(db: any) {}
}