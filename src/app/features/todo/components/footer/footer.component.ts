import { AfterContentInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {FilterType, TodoFilterNames} from '../../constants'
import {TodoFilters} from '../../filters'
import * as Util from '~core/util';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
			<!-- This footer should hidden by default and shown when there are todos -->
			<footer class="footer">
				<!-- This should be 0 items left by default -->
				<span class="todo-count"><strong>{{leftItemsCount}}</strong> item left</span>
				<!-- Remove this if you don't implement routing -->
				<ul class="filters">
					<li *ngFor="let filterName of objectKeys(filters)">
						<a [ngClass]="{'selected' : filterName === filter}"
              href="#/"
              attr.data-filter="{{filterName}}"
              (click)="handleFilterTodo($event)">
              {{util.toFirstUpperCase(filterName)}}
            </a>
					</li>
				</ul>
				<!-- Hidden if no completed items are left ↓ -->
				<button class="clear-completed"
        *ngIf="completedItemsCount !== 0"
        (click)="handleClearCompletedTodo($event)"
        >
          Clear completed
        </button>
			</footer>
  `,
  styleUrls: ['./footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnChanges, AfterContentInit, OnInit {

  // utility functions
  public objectKeys = Object.keys;
  public util = Util;

  public filters =  TodoFilters;
  public filterNames = TodoFilterNames;

  @Input() leftItemsCount = 0;
  @Input() completedItemsCount = 0;
  @Input() filter = this.filterNames.ALL;

  @Output() onFilterTodo = new EventEmitter<FilterType>();
  @Output() onClearCompletedTodo = new EventEmitter<FilterType>();

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {

  }

  public handleFilterTodo(event: MouseEvent): void {
    const target = event.target as HTMLAnchorElement;
    this.onFilterTodo.emit(target.dataset['filter'] as FilterType)

  }

  public handleClearCompletedTodo(event: MouseEvent): void {
    this.onClearCompletedTodo.emit(this.filterNames.COMPLETED);
  }



}
