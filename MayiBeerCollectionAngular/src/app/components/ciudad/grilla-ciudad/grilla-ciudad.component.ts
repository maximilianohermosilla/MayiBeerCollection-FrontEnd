import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CiudadService } from 'src/app/services/ciudad.service';

@Component({
  selector: 'app-grilla-ciudad',
  templateUrl: './grilla-ciudad.component.html',
  styleUrls: ['./grilla-ciudad.component.css']
})
export class GrillaCiudadComponent {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: any;
  nombreColumnas: string[] = ["nombre", "pais", "acciones"];

  constructor(private servicioCiudad: CiudadService) { }

  ngOnInit(): void {
    this.servicioCiudad.GetAll().subscribe((rta: any[]) => {
      this.dataSource = new MatTableDataSource<any[]>(rta);
      this.dataSource.paginator = this.paginator;
    })
  }

  ver(db: any) {}
}