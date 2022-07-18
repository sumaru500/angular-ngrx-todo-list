import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Todo, toBoolean, OnOFF } from '~model/todo';

@Component({
  selector: 'app-todo-item',
  template: `
    <!-- List items should get the class editing when editing and completed when marked as completed -->
    <li [ngClass]="{'completed' : todo.completed, 'editing' : isEditing}" *ngIf="todo">
      <div class="view">
        <input class="toggle" type="checkbox"
          [checked]="todo.completed"
          (change)="todo.completed = !todo.completed"
          (click)="handleToggleTodo($event)">
        <label (dblclick)="isEditing = !isEditing">{{todo.title}}</label>
        <button class="destroy" (click)="handleRemoveTodo($event)"></button>
      </div>
      <input class="edit"
        [value]="editValue"
        (keyup)="handleEditTodo($event)"
        (blur)="handleCancelEditTodo($event)"
      >
    </li>
    <!-- <li>
      <div class="view">
        <input class="toggle" type="checkbox">
        <label>Buy a unicorn</label>
        <button class="destroy"></button>
      </div>
      <input class="edit" value="Rule the web">
    </li> -->
  `,
  styleUrls: ['./todo-item.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent implements OnInit {
  @Input() todo? : Todo

  public isEditing: boolean = false;
  public editValue: string | undefined;

  @Output() onToggleTodo = new EventEmitter<Todo>();
  @Output() onEditTodo = new EventEmitter<Todo>();
  @Output() onRemoveTodo = new EventEmitter<Todo>();

  constructor() { }

  ngOnInit(): void {
    this.editValue = this.todo?.title;
  }

  public handleToggleTodo(event: MouseEvent): void {
    const checkbox = event.target as HTMLInputElement;
    this.onToggleTodo.emit({id:  this.todo?.id, completed: checkbox.checked});
  }

  public handleEditTodo(event: KeyboardEvent): void {
    const  text = event.target as HTMLInputElement;
    if (event.keyCode === 13) {
      this.onEditTodo.emit({id:  this.todo?.id, title: text.value});
      this.isEditing = false;
    }
    else if (event.keyCode === 27) {
      this.handleCancelEditTodo(event)
    }
  }

  public handleCancelEditTodo(event: Event): void {
    this.isEditing = false;
    this.editValue = this.todo?.title;
  }

  public handleRemoveTodo(event: MouseEvent) : void {
    this.onRemoveTodo.emit({id: this.todo?.id});
  }
}
