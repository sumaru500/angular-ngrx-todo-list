import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, of, switchMap, map, delay, tap } from "rxjs";
import { State } from "~model";
import { TodoService } from "../services/todo.service";
import { addTodoAsync, clearCompletedTodoAsync, deleteTodo, editEndTodoAsync, fetchTodoAsync, removeTodoAsync, socketNotifiedTodoAsync, toggleAllTodoAsync, toggleTodoAsync } from "./todo.actions";
import * as TodoSocketTypeNames from "./todo.socket.action.names"
@Injectable()
export class TodoEffects {
    constructor(
      private actions$ : Actions,
      private store: Store<State>, // used in case get data directly by selector then pass to service
      private todoService: TodoService // service call API and return an Observable
    ) {}

    // FETCH TODOS Effect
    // this code declaration is trigged when a fetchTodoAsync.request action is dispatch
    // (from an UI handler or wherever in app)
    fetchTodoEffect$ = createEffect(() =>
      this.actions$.pipe(
        // filter only fetchTodoAsync.request
        ofType(fetchTodoAsync.request),
        delay(500),
        // switch to Observable return by api call
        switchMap((action) =>
          // API call
          this.todoService.getTodos().pipe(
            // map result to success action call
            map(todos => fetchTodoAsync.success({todos})),
            // when error => return a new failure action
            catchError((error: string) => of(fetchTodoAsync.failure({error})))
          )
        )
      )
    );

    // ADD TODO Effect
    addTodoEffect$ = createEffect(() =>
      this.actions$.pipe(
        // filter only addTodoAsync.request
        ofType(addTodoAsync.request),
        delay(500),
        switchMap((action) =>
          // API call
          this.todoService.addTodo(action.todo).pipe(
            map(todo => addTodoAsync.success({todo})),
            catchError((error: string) => of(addTodoAsync.failure({error})))
          )
        )
      )
    );

    // REMOVE TODO Effect
    removeTodoEffect$ = createEffect(() =>
      this.actions$.pipe(
        // filter only removeTodoAsync.request
        ofType(removeTodoAsync.request),
        delay(500),
        switchMap(action =>
          // API call
          this.todoService.deleteTodo(action.todo).pipe(
              map(todo => removeTodoAsync.success({todo})),
              catchError((error: string) => of(removeTodoAsync.failure({error})))
          )
        )
      )
    );

    // TOGGLE TODO Effect
    toggleTodoEffect$ = createEffect(() =>
      this.actions$.pipe(
        // filter only toggleTodoAsync.request
        ofType(toggleTodoAsync.request),
        delay(500),
        switchMap(action =>
          // API call
          this.todoService.updateTodo(action.todo).pipe(
            map(todo => toggleTodoAsync.success({todo})),
            catchError((error: string) => of(toggleTodoAsync.failure({error})))
          )
        )
      )
    );

    // TOGGLE ALL TODOS Effect
    toggleAllTodoEffect$ = createEffect(() =>
      this.actions$.pipe(
        // filter only toggleAllTodoAsync.request
        ofType(toggleAllTodoAsync.request),
        delay(500),
        switchMap(action =>
          // API call
          this.todoService.toggleAllTodo(action.todos).pipe(
            map(todos => toggleAllTodoAsync.success({todos})),
            catchError((error: string) => of(toggleAllTodoAsync.failure({error})))
          )
        )
      )
    );

    // EDIT END TODO Effect
    editEndTodoEffect$ = createEffect(() =>
      this.actions$.pipe(
        // filter only editEndTodoAsync.request
        ofType(editEndTodoAsync.request),
        delay(500),
        switchMap(action =>
          // API call
          this.todoService.updateTodo(action.todo).pipe(
            map(todo => editEndTodoAsync.success({todo})),
            catchError((error: string) => of(editEndTodoAsync.failure({error})))
          )
        )
      )
    );

    // CLEAR COMPLETED TODOS Effect
    clearCompletedTodoEffect$ = createEffect(() =>
      this.actions$.pipe(
        // filter only clearCompletedTodoAsync.request
        ofType(clearCompletedTodoAsync.request),
        delay(500),
        switchMap(action =>
          // API call
          this.todoService.clearTodos(action.todos).pipe(
            map(todos => clearCompletedTodoAsync.success({todos})),
            catchError((error: string) => of(clearCompletedTodoAsync.failure({error})))
          )
        )
      )
    );

    // SOCKET NOTIFIED TODO Effect
    socketNotifiedTodoEffect$ = createEffect(() =>
      this.actions$.pipe(
        // filter only socketNotifiedTodoAsync.request
        ofType(socketNotifiedTodoAsync.request),
        switchMap(action => {
            if (action.socketType.type === TodoSocketTypeNames.DELETE_TODO) {
              // ignore call API, delete directly by an sync action
              return of(deleteTodo({todo : {id: action.socketType.id}}))
            }
            else {
              // TODO: when toggle all, only the last socket notified can be triggered the success
              // API call to get single todo
              return this.todoService.getTodo({id: action.socketType.id}).pipe(
                tap((todo) => console.log([todo])),
                map((todo) => socketNotifiedTodoAsync.success({todo})),
                catchError((error) => of(socketNotifiedTodoAsync.failure({error: error})))
              )
            }
          }
        )
      )
    );

    // another example using later call API
    // Run this code when the addTodo or removeTodo action is dispatched
    // saveTodosEffect$ = createEffect(
    //   () =>
    //     this.actions$.pipe(
    //       ofType(addTodo, removeTodo),
    //       withLatestFrom(this.store.select(selectAllTodos)),
    //       switchMap(([action, todos]) => from(this.todoService.saveTodos(todos)))
    //     ),
    //   // Most effects dispatch another action, but this one is just a "fire and forget" effect
    //   { dispatch: false }
    // );

 }
