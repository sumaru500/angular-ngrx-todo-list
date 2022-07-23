import { Injectable } from '@angular/core';
import { forkJoin, from, Observable } from 'rxjs';
import {map, tap, delay} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import { IDType, SocketDataType, DELETE_TODO, Todo } from '~model/todo';
import { environment } from '~core/environment';
// import { APIData } from '~core/api';
import { Store } from '@ngrx/store';
import { WebSocketService } from '~core/websocket';
import { socketNotifiedTodoAsync } from '../state/todo.actions';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private http : HttpClient, private store: Store, private webSocketService: WebSocketService) {


    // subcribe topic for web socket
    this.webSocketService.clientSocket.on('todos', (data: SocketDataType) => {
      console.log('Received data:', data);

      // dispatch socketNotifiedTodoAsync.request
      this.store.dispatch(socketNotifiedTodoAsync.request({socketType: data}));
    });
  }

  /**
   * Get a todo by id from the API
   */
  getTodo(todo: Todo ): Observable<Todo> {

    const getTodoUrl = `${environment.apiUrl}/${environment.todoUri}/${todo.id}`;
    console.log(getTodoUrl);
    return this.http.get<Todo>(getTodoUrl).pipe(
      delay(1000),
      tap(data => console.log(data))
    );
  }
  /**
   * Get a list of todos from the API
   */
  getTodos(): Observable<Todo[]> {

    const getAllTodosUrl = `${environment.apiUrl}/${environment.todoUri}`;
    console.log(getAllTodosUrl);
    return this.http.get<Todo[]>(getAllTodosUrl).pipe(
      delay(1000),
      tap(data => console.log(data))
    );
  }

  addTodo(todo: Todo): Observable<Todo> {
    const getAddTodoUrl = `${environment.apiUrl}/${environment.todoUri}`;
    console.log(getAddTodoUrl);
    return this.http.post<Todo>(getAddTodoUrl, todo).pipe(
      delay(1000),
      tap(data => console.log(data))
    );
  }

  updateTodo(todo: Todo) : Observable<Todo>{
    const getUpdateTodoUrl = `${environment.apiUrl}/${environment.todoUri}/${todo.id}`;
    console.log(getUpdateTodoUrl);
    return this.http.patch<Todo>(getUpdateTodoUrl, todo).pipe(
      delay(1000),
      tap(data => console.log(data))
    );
  }

  deleteTodo(todo: Todo) : Observable<Todo>{
    const getDeleteTodoUrl = `${environment.apiUrl}/${environment.todoUri}/${todo.id}`;
    console.log(getDeleteTodoUrl);
    return this.http.delete<Todo>(getDeleteTodoUrl).pipe(
      delay(1000),
      tap(data => console.log(data))
    );
  }

  toggleAllTodo(todos: Todo[]) : Observable<Todo[]> {
    // call API in parallel
    const parallelObservables = todos.map(todo =>
      from(this.http.patch<Todo>(`${environment.apiUrl}/${environment.todoUri}/${todo.id}`, {completed: todo.completed}))
    );

    // run
    return forkJoin(parallelObservables)
            .pipe(
              delay(1000),
              tap(data => console.log(data))
            )
  }

  clearTodos(todos: Todo[]) : Observable<Todo[]> {
    // call API in parallel
    const parallelObservables = todos.map(todo =>
      from(this.http.delete<Todo>(`${environment.apiUrl}/${environment.todoUri}/${todo.id}`))
    );

    // run
    return forkJoin(parallelObservables)
            .pipe(
              delay(1000),
              tap(data => console.log(data))
            )
  }

}
