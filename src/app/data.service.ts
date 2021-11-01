import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  private goals = new BehaviorSubject<any>(['Escalar el Monte Everest', 'Graduarme']);
  goal = this.goals.asObservable();

  constructor() { }

  changeGoal(goal: any) {
    this.goals.next(goal);
  }
}
