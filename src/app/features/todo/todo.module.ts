import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TodoPageComponent } from './pages/todo-page/todo-page.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';



@NgModule({
  declarations: [
    TodoPageComponent,
    HeaderComponent,
    FooterComponent,
    TodoItemComponent,
    TodoListComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  exports: [
    TodoPageComponent
  ]
})
export class TodoModule { }
