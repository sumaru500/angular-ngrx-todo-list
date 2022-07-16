import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
			<header class="header">
				<h1>todos</h1>
				<input class="new-todo"
          placeholder="What needs to be done?"
          autofocus
          (keyup)="handleAddTodo($event)"
        >
			</header>
  `,
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() onAddTodo = new EventEmitter()
  constructor() { }

  ngOnInit(): void {
  }

  public handleAddTodo($event: KeyboardEvent) : void {
    const input = $event.target as HTMLInputElement;
    if ($event.keyCode === 13 && input.value) {
      // emit event to parent page
      this.onAddTodo.emit(input.value);
      // clear input
      input.value = '';
    }
  }

}
