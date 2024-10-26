import { JsonPipe } from '@angular/common';
import {
  OnInit,
  Component,
  OnDestroy,
  input,
  output,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { angularFormsModule, angularModule } from '@app/core/modules';
import { AccessControlDirective } from '@app/shared/directives/access-control.directive';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { GlobalSearchClearService } from '@app/core/services';

export type IButtonConfig = {
  icon?: string;
  label: string;
};
export type IEvalutionTagConfig = {
  name: string;
  profile: string;
  role: string;
};

@Component({
  selector: 'list-filter',
  standalone: true,
  imports: [
    angularFormsModule,
    JsonPipe,
    AccessControlDirective,
    angularModule,
  ],
  templateUrl: './list-filter.component.html',
  styleUrls: ['./list-filter.component.scss'],
})
export class ListFilterComponent implements OnInit, OnDestroy {
  public pageTitle = input<string>('', { alias: 'page-title' });
  public pageTitleMilestoneTag = input<string>('', {
    alias: 'page-title-milestone-tag',
  });
  @Input() publish: boolean = false;
  @Input() publishForDetails: boolean = false;
  @Input() globalSearch: boolean = true;
  @Input() selectedName!: string;
  public pageTitleEvalutionTag = input<IEvalutionTagConfig>(
    Object.create(null),
    {
      alias: 'page-title-evalution-tag',
    }
  );
  public object: ObjectConstructor = Object;

  public filterStatus = input<boolean>(false, { alias: 'filter-status' });

  public primaryAddButton = input<IButtonConfig>(Object.create(null), {
    alias: 'primary-add-button',
  });
  public subscription: Subscription = new Subscription();
  public subscriptions: Subscription[] = [];
  public searchPlaceholder = input<string>('', { alias: 'search-placeholder' });
  // public searchModel = signal<string | null>("");
  public searchModel!: string;
  public searchModelSub$: Subject<string> = new Subject<string>();
  public isReadReceipt: boolean = false;

  public filteredByValue: number | null = null;

  openSidebar = output<MouseEvent>({ alias: 'open-sidebar' });
  clearInput: boolean = false;
  @Output() onSearch: EventEmitter<string> = new EventEmitter<string>();
  @Output() filteredBy: EventEmitter<number | null> = new EventEmitter();
  @Output() publishNow: EventEmitter<any> = new EventEmitter();
  get clearInputSearchListFilter(): boolean {
    return this.clearInput;
  }
  @Input('clearInputSearchListFilter') set clearInputSearchListFilter(
    value: boolean
  ) {
    if (value) {
      this.clearInput = value;
      if (this.clearInput) {
        this.searchModelSub$.next('');
      }
    }
  }

  @Input('isMileStoneFilterApplied') set isMileStoneFilterApplied(
    value: boolean
  ) {
    if (value) {
      this.filteredByValue = null;
    }
  }
  @Input() moduleId: number = 0;
  @Input() submoduleId: number = 0;
  @Input() actionId: number = 0;

  constructor(private _globalSearchClear: GlobalSearchClearService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.searchModelSub$.pipe(debounceTime(400)).subscribe({
        next: (value) => {
          this.onSearch.emit(value);
          this.searchModel = value;
        },
      })
    );
    this.subscriptions.push(
      this._globalSearchClear.filterInput$.subscribe((data) => {
        if (data !== null) {
          this.searchModel = '';
        }
      })
    );
  }
  public onChangeSearch(searchValue: any) {
    if (searchValue === '') {
      searchValue = null;
    }
    this.searchModel = searchValue;
    this.searchModelSub$.next(searchValue);
    this.filteredByValue = null;
  }

  onAddPrimaryClick(event: MouseEvent) {
    this.openSidebar.emit(event);
  }

  onPublshClick() {
    this.publishNow.emit();
  }

  onFilteredBy(value: number | null) {
    this.filteredByValue = value;
    this.filteredBy.emit(value);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
