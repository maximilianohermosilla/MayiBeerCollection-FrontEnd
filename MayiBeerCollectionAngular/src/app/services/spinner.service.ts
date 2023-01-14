import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  blockUI: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  //blockUI$ = new Subject<boolean>();

  show(): void{
    //this.blockUI$.next(true);
    this.blockUI.next(true);
  }
  hide(): void{
    //this.blockUI$.next(false);
    this.blockUI.next(false);
  }
  constructor() { }
}
