import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { EstiloService } from 'src/app/services/estilo.service';

@Component({
  selector: 'app-grilla-estilo',
  templateUrl: './grilla-estilo.component.html',
  styleUrls: ['./grilla-estilo.component.css']
})
export class GrillaEstiloComponent {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: any;
  nombreColumnas: string[] = ["nombre", "acciones"];

  constructor(private servicioEstilo: EstiloService) { }

  ngOnInit(): void {
    this.servicioEstilo.GetAll().subscribe((rta: any[]) => {
      this.dataSource = new MatTableDataSource<any[]>(rta);
      this.dataSource.paginator = this.paginator;
    })
  }

  ver(db: any) {}
}
