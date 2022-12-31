import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CervezaService } from 'src/app/services/cerveza.service';

@Component({
  selector: 'app-grilla-cerveza',
  templateUrl: './grilla-cerveza.component.html',
  styleUrls: ['./grilla-cerveza.component.css']
})
export class GrillaCervezaComponent {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: any;
  nombreColumnas: string[] = ["nombre", "marca", "estilo", "ibu", "alcohol", "ciudad", "acciones"];

  constructor(private servicioCerveza: CervezaService) { }

  ngOnInit(): void {
    this.servicioCerveza.GetAll().subscribe((rta: any[]) => {
      this.dataSource = new MatTableDataSource<any[]>(rta);
      this.dataSource.paginator = this.paginator;
    })
  }

  ver(db: any) {}
}