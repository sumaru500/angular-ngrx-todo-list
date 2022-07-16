import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-todo-page></app-todo-page>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-rxjs-todo-list';
}
