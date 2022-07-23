import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { BehaviorSubject, finalize, Observable, lastValueFrom, take, filter as rxFilter  } from 'rxjs';
import {FilterType, TodoFilterNames} from '../../constants'
import {TodoFilters} from '../../filters'
import { Todo } from '~model/todo';
import { Store } from '@ngrx/store';
import { TodoService } from '../../services/todo.service';
import * as TodoSelectors from '../../state/todo.selectors';
import { State } from '~model';
import { AsyncStatus, Status } from '~model/common/async.status';
import {getCurrentValue} from '~core/util';
import { addTodoAsync, clearCompletedTodoAsync, editEndTodoAsync, fetchTodoAsync, removeTodoAsync, toggleAllTodoAsync, toggleTodoAsync } from '../../state/todo.actions';

@Component({
  selector: 'app-todo-page',
  template: `
		<section class="todoapp">
    <app-header (onAddTodo)="handleAddTodo($event)"></app-header>
			<!-- This section should be hidden by default and shown when there are todos -->
			<section class="main">
        <app-todo-list *ngIf="(todos$ | async) as todos" [todos]="todos.filter(filters[filter])"
          (onToggleTodo)="handleToggleTodo($event)"
          (onEditTodo)="handleEditTodo($event)"
          (onRemoveTodo)="handleRemoveTodo($event)"
          (onToggleAllTodo)="handleToggleAllTodo($event)"
          ></app-todo-list>
        <!-- <ng-template *ngIf="isLoadingTodos"> -->

        <div *ngIf="(statusFetch$ | async)?.status === 'loading'" class="center">
          <mat-progress-spinner  mode="indeterminate"></mat-progress-spinner>
        </div>
       <!-- </ng-template> -->
      </section>
      <app-footer
        [leftItemsCount]="(todos$ | async)?.filter(filters[filterNames.ACTIVE])?.length || 0"
        [completedItemsCount]="(todos$ | async)?.filter(filters[filterNames.COMPLETED])?.length || 0"
        [filter]="filter"
        (onFilterTodo)="handleFilterTodo($event)"
        (onClearCompletedTodo)="handleClearTodo($event)"
      ></app-footer>
		</section>
  `,
  styleUrls: ['./todo-page.component.css']
})
export class TodoPageComponent implements OnInit {
  public filters =  TodoFilters;
  public filterNames = TodoFilterNames;

  public statusFetch$ : Observable<Status> = this.store.select(TodoSelectors.selectStatusFetch);
  public statusAdd$ : Observable<Status> = this.store.select(TodoSelectors.selectStatusAdd);
  public statusRemove$ : Observable<Status> = this.store.select(TodoSelectors.selectStatusRemove);
  public statusToggle$ : Observable<Status> = this.store.select(TodoSelectors.selectStatusToggle);
  public statusToggleAll$ : Observable<Status> = this.store.select(TodoSelectors.selectStatusToggleAll);
  public statusEditEnd$ : Observable<Status> = this.store.select(TodoSelectors.selectStatusEditEnd);
  public statusClearCompleted$ : Observable<Status> = this.store.select(TodoSelectors.selectStatusClearCompleted);

  public leftItemsCount = 0;
  public filter : FilterType = this.filterNames.ALL;
  // private todosSubject : BehaviorSubject<Todo[]> = new BehaviorSubject([] as Todo[]);
  public todos$: Observable<Todo[]> = this.store.select(TodoSelectors.selectAllTodos);;

  constructor(private store: Store<State>,
              private service: TodoService,
              private snackbar: MatSnackBar) { }

  ngOnInit(): void {

    // init todos by dispatch a request async action
    this.store.dispatch(fetchTodoAsync.request());
  }

  // getTodos(): Observable<Todo[]> {
  //   return this.todosSubject.asObservable();
  // }

  /**
   * add a new todo
   * @param title
   */
  public handleAddTodo(title: string) : void {
    this.store.dispatch(addTodoAsync.request({todo: {
      title,
      completed : false
    }}));

    // TODO subcribe on status observable??? in ngOnInit???
    let subcription = this.statusAdd$.pipe(
      rxFilter(status => status.status === 'success'),
      take(1),
      finalize(() => {subcription.unsubscribe()})
      )
      .subscribe((status) => {
        this.snackbar.open(`Todo ${title} added successfully`, undefined, {duration: 2000});
      })

  }

  public handleToggleTodo({id, completed} : Todo) : void {
    console.log('Toggle Todo', id, completed);
    this.store.dispatch(toggleTodoAsync.request({todo: {id, completed}}))

    // TODO subcribe on status observable??? in ngOnInit???
    let subcription = this.statusToggle$.pipe(
      rxFilter(status => status.status === 'success'),
      take(1),
      finalize(() => {subcription.unsubscribe()})
      )
      .subscribe((status) => {
        this.snackbar.open(`Todo toggled successfully`, undefined, {duration: 2000});
      })

  }

  public handleEditTodo({id, title}: Todo) : void {
    this.store.dispatch(editEndTodoAsync.request({todo: {id, title}}))

    // TODO subcribe on status observable??? in ngOnInit???
    let subcription = this.statusEditEnd$.pipe(
      rxFilter(status => status.status === 'success'),
      take(1),
      finalize(() => {subcription.unsubscribe()})
      )
      .subscribe((status) => {
        this.snackbar.open(`Todo ${title} update title successfully`, undefined, {duration: 2000});
      })

  }

  public handleRemoveTodo({id}: Todo) : void {
    this.store.dispatch(removeTodoAsync.request({todo: {id}}))

    // TODO subcribe on status observable??? in ngOnInit???
    let subcription = this.statusRemove$.pipe(
      rxFilter(status => status.status === 'success'),
      take(1),
      finalize(() => {subcription.unsubscribe()})
      )
      .subscribe((status) => {
        this.snackbar.open(`Todo removed successfully`, undefined, {duration: 2000});
      })

  }

  public async handleToggleAllTodo(checkedAll : boolean) {
    const todos = await lastValueFrom(this.todos$.pipe(take(1))) || []; // get current value in state
    const updateTodos = todos?.map(todo => ({ ...todo, completed: checkedAll }));
    this.store.dispatch(toggleAllTodoAsync.request({todos: updateTodos}))

    // TODO subcribe on status observable??? in ngOnInit???
    let subcription = this.statusToggleAll$.pipe(
      rxFilter(status => status.status === 'success'),
      take(1),
      finalize(() => {subcription.unsubscribe()})
      )
      .subscribe((status) => {
        this.snackbar.open(`Toggle All successfully`, undefined, {duration: 2000});
      })

  }

  public handleFilterTodo(filter: FilterType): void {
    this.filter = filter;
  }

  public async handleClearTodo(filter: FilterType ) {
    // const todos = this.todosSubject.getValue();
    const todos = await getCurrentValue(this.store, TodoSelectors.selectAllTodos) || []; // get current value in state
    console.log("clear todos", todos)
    const clearTodos = todos.filter(this.filters[filter]);
    const clearIds = clearTodos.map(clearTodos => clearTodos.id);
    const restTodos = todos.filter(todo => !clearIds.includes(todo.id)) || [];
    this.store.dispatch(clearCompletedTodoAsync.request({todos: clearTodos}));

    // TODO subcribe on status observable??? in ngOnInit???
    let subcription = this.statusClearCompleted$.pipe(
      rxFilter((status : Status) => status.status === 'success'),
      take(1),
      finalize(() => {subcription.unsubscribe()})
      )
      .subscribe((status) => {
        this.snackbar.open(`Clear successfully`, undefined, {duration: 2000});
      })

  }

}
