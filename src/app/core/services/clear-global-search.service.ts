import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class GlobalSearchClearService {
  /* Set input of filters to clear global search input */
  private filterInput: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public filterInput$ = this.filterInput.asObservable();

  public setFilterInput(data: any) {
    this.filterInput.next(data);
  }
}
