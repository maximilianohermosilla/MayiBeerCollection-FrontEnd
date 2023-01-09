import { Pipe, PipeTransform } from '@angular/core';
import { Cerveza } from 'src/app/models/cerveza';
import { filter } from 'rxjs/operators';
import { map } from 'rxjs/operators/';
import { Observable, Subject, tap } from 'rxjs';
//Object.assign(Actions.prototype, {  map, filter });

@Pipe({
  name: 'filterCerveza'
})
export class FilterPipe implements PipeTransform {
  cervezasFiltered: Cerveza[] = [];
  transform(cervezas: Cerveza[], filterText: string): any {
    if (!cervezas || filterText == "") {
        return cervezas;
    }
    else{  
      this.cervezasFiltered = cervezas;
      this.cervezasFiltered = this.cervezasFiltered.filter((cerveza) => cerveza.nombre.toLowerCase().includes(filterText.toLowerCase()) );
      return this.cervezasFiltered;
    }
}
}