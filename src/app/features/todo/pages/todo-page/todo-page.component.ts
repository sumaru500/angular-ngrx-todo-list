import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import {FilterType, TodoFilterNames} from '../../constants'
import {TodoFilters} from '../../filters'
import { Todo } from '~model/todo';
import { Store } from '~core/store';
import { TodoService } from '../../services/todo.service';

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

        <div *ngIf="isLoadingTodos" class="center">
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

  public isLoadingTodos = false;
  public leftItemsCount = 0;
  public filter : FilterType = this.filterNames.ALL;
  // private todosSubject : BehaviorSubject<Todo[]> = new BehaviorSubject([] as Todo[]);
  public todos$?: Observable<Todo[]>;

  constructor(private store: Store,
              private service: TodoService,
              private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.todos$ = this.store.select('todos');
    // init todos
    this.isLoadingTodos = true;
    this.service.getTodos().pipe(
      finalize(() => this.isLoadingTodos = false)
    )
    .subscribe(
      // (todos) => this.todosSubject.next(todos)
      (todos) => this.store.update({todos})
    );
  }

  // getTodos(): Observable<Todo[]> {
  //   return this.todosSubject.asObservable();
  // }

  /**
   * add a new todo
   * @param title
   */
  public handleAddTodo(title: string) : void {
    this.service.addTodo({
      title,
      completed : false
    })
    .subscribe(returnTodo => {
      if (returnTodo) {
        const todos = this.store.selectSnapshot('todos');
        todos?.push(returnTodo);
        this.store.update({todos}); // or using _.cloneDeep()
        this.snackbar.open(`Todo ${title} added successfully`, undefined, {duration: 2000});
      }
    });
  }

  public handleToggleTodo({id, completed} : Todo) : void {
    console.log('Toggle Todo', id, completed);
    this.service.updateTodo({id, completed})
    .subscribe(returnTodo => {
      const todos = this.store.selectSnapshot('todos');
      const toggleTodo = todos?.find(todo => todo.id === id);
      if (toggleTodo) {
        toggleTodo.completed = completed;
        this.store.update({todos}); // or using _.cloneDeep()
        this.snackbar.open(`Todo ${toggleTodo.title} toggled successfully`, undefined, {duration: 2000});
      }
    })
  }

  public handleEditTodo({id, title}: Todo) : void {
    this.service.updateTodo({id, title})
    .subscribe(returnTodo => {
      // const todos = this.todosSubject.getValue();
      const todos = this.store.selectSnapshot('todos');
      const editedTodo = todos?.find(todo => todo.id === id);
      if (editedTodo) {
        editedTodo.title = title;
        // this.todosSubject.next([...todos]); // or using _.cloneDeep()
        this.store.update({todos}); // or using _.cloneDeep()
        this.snackbar.open(`Todo ${editedTodo.title} update title successfully`, undefined, {duration: 2000});
      }
    })
  }

  public handleRemoveTodo({id}: Todo) : void {
    this.service.deleteTodo({id})
    .subscribe(returnTodo => {
      // const todos = this.todosSubject.getValue();
      const todos = this.store.selectSnapshot('todos');
      const removedTodo = todos?.filter(todo => todo.id === id)[0];
      const newTodos = todos?.filter(todo => todo.id !== id);
      if (removedTodo) {
        // this.todosSubject.next([...newTodos]); // or using _.cloneDeep()
        this.store.update({todos}); // or using _.cloneDeep()
        this.snackbar.open(`Todo ${removedTodo.title} removed successfully`, undefined, {duration: 2000});
      }
    })
  }

  public handleToggleAllTodo(checkedAll : boolean) : void {
    // const todos = this.todosSubject.getValue();
    const todos = this.store.selectSnapshot('todos') || [];
    const updateTodos = todos?.map(todo => ({ ...todo, completed: checkedAll }));
    this.service.toggleAllTodo(updateTodos)
    .subscribe(returnTodos => {
        // this.todosSubject.next(updateTodos)
        this.store.update({todos}); // or using _.cloneDeep()
        this.snackbar.open(`Toggle All successfully`, undefined, {duration: 2000});

    })
  }

  public handleFilterTodo(filter: FilterType): void {
    this.filter = filter;
  }

  public handleClearTodo(filter: FilterType ): void {
    // const todos = this.todosSubject.getValue();
    const todos = this.store.selectSnapshot('todos') || [];
    const clearTodos = todos.filter(this.filters[filter]);
    const clearIds = clearTodos.map(clearTodos => clearTodos.id);
    const restTodos = todos.filter(todo => !clearIds.includes(todo.id)) || [];
    this.service.clearTodos(clearTodos)
    .subscribe(returnTodos => {
        // this.todosSubject.next([...restTodos])
        this.store.update({todos: restTodos}); // or using _.cloneDeep()
        this.snackbar.open(`Clear successfully`, undefined, {duration: 2000});

    })
  }

}
