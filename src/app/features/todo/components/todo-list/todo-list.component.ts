import { AfterContentInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Todo } from '~model/todo';

@Component({
  selector: 'app-todo-list',
  template: `
				<input id="toggle-all" class="toggle-all" type="checkbox"
          [checked]="checkedAll"
          (click)="handleToggleAllTodo($event)"
        >
				<label for="toggle-all">Mark all as complete</label>
				<ul class="todo-list">
					<!-- These are here just to show the structure of the list items -->
          <app-todo-item *ngFor="let todo of todos" [todo]="todo"
            (onToggleTodo)="handleToggleTodo($event)"
            (onEditTodo)="handleEditTodo($event)"
            (onRemoveTodo)="handleRemoveTodo($event)"
          ></app-todo-item>
				</ul>
  `,
  styleUrls: ['./todo-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TodoListComponent implements AfterContentInit, OnInit {

  @Input() todos: Todo[] = [];
  @Output() onToggleTodo = new EventEmitter();
  @Output() onEditTodo = new EventEmitter();
  @Output() onRemoveTodo = new EventEmitter();
  @Output() onToggleAllTodo = new EventEmitter();

  public checkedAll: boolean = false;

  constructor() { }

  ngAfterContentInit(): void {
    if (this.todos != null) {
      console.log("todos loaded", [...this.todos])
    }
  }

  ngOnInit(): void {
    this.checkedAll = false; // init later based on todos
  }

  public handleToggleTodo(todo: Todo): void {
    this.onToggleTodo.emit(todo);
  }

  public handleEditTodo(todo: Todo): void {
    this.onEditTodo.emit(todo);
  }

  public handleRemoveTodo(todo: Todo): void {
    this.onRemoveTodo.emit(todo);
  }

  public handleToggleAllTodo(event: MouseEvent): void {
    const checkbox = event.target as HTMLInputElement;
    this.onToggleAllTodo.emit(checkbox.checked);
  }

}
