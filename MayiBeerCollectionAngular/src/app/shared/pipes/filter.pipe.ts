import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resultCiudades = [];
    for(const ciudad of value){
      console.log(ciudad);
      if(ciudad.nombre.indexOf(arg) > -1){
        resultCiudades.push(ciudad);
      };
    };
    return resultCiudades;
  }

}