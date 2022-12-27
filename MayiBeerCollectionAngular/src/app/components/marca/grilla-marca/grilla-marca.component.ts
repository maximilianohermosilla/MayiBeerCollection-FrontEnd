import { Component, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MarcaService } from 'src/app/services/marca.service';

@Component({
  selector: 'app-grilla-marca',
  templateUrl: './grilla-marca.component.html',
  styleUrls: ['./grilla-marca.component.css']
})
export class GrillaMarcaComponent {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  dataSource: any;
  nombreColumnas: string[] = ["nombre", "acciones"];

  constructor(private serviceMarca: MarcaService) { }

  ngOnInit(): void {
    this.serviceMarca.GetAll().subscribe((rta: any[]) => {
      this.dataSource = new MatTableDataSource<any[]>(rta);
      this.dataSource = rta;
      console.log(rta);
    })
  }

  ver(db: any) {}
}
