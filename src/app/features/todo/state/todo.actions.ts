import { createAction, props, union } from "@ngrx/store";
import * as TodoActionNames from "./todo.action.names";
import * as TodoSocketTypeNames from "./todo.socket.action.names";
import FilterType from "~model/todo/todo.filter.names"
import { Todo, SocketDataType } from "~model/todo";

// --------------------SYNC actions ----------------------------------------------------//
export const filterTodo = createAction(TodoActionNames.FILTER_TODO, props<{filter: FilterType}>())
export const deleteTodo = createAction(TodoSocketTypeNames.DELETE_TODO, props<{todo: Todo}>())

// --------------------ASYNC actions ----------------------------------------------------//
// FETCH TODO functionality
export const fetchTodoAsync =
  {
    request: createAction(TodoActionNames.FETCH_TODO_REQUEST),
    success: createAction(TodoActionNames.FETCH_TODO_SUCCESS, props<{todos: Todo[]}>()),
    failure: createAction(TodoActionNames.FETCH_TODO_FAILURE, props<{error: string}>()),
  };

// ADD TODO functionality
export const addTodoAsync =
  {
    request: createAction(TodoActionNames.ADD_TODO_REQUEST, props<{todo: Todo}>()),
    success: createAction(TodoActionNames.ADD_TODO_SUCCESS, props<{todo: Todo}>()),
    failure: createAction(TodoActionNames.ADD_TODO_FAILURE, props<{error: string}>()),
  };

// REMOVE TODO functionality
export const removeTodoAsync =
  {
    request: createAction(TodoActionNames.REMOVE_TODO_REQUEST, props<{todo: Todo}>()),
    success: createAction(TodoActionNames.REMOVE_TODO_SUCCESS, props<{todo: Todo}>()),
    failure: createAction(TodoActionNames.REMOVE_TODO_FAILURE, props<{error: string}>()),
  };

// TOGGLE TODO functionality
export const toggleTodoAsync =
  {
    request: createAction(TodoActionNames.TOGGLE_TODO_REQUEST, props<{todo: Todo}>()),
    success: createAction(TodoActionNames.TOGGLE_TODO_SUCCESS, props<{todo: Todo}>()),
    failure: createAction(TodoActionNames.TOGGLE_TODO_FAILURE, props<{error: string}>()),
  };

// TOGGLE ALL TODO functionality
export const toggleAllTodoAsync =
  {
    request: createAction(TodoActionNames.TOGGLE_ALL_TODO_REQUEST, props<{todos: Todo[]}>()),
    success: createAction(TodoActionNames.TOGGLE_ALL_TODO_SUCCESS, props<{todos: Todo[]}>()),
    failure: createAction(TodoActionNames.TOGGLE_ALL_TODO_FAILURE, props<{error: string}>()),
  };

// EDIT END TODO functionality
export const editEndTodoAsync =
  {
    request: createAction(TodoActionNames.EDIT_END_TODO_REQUEST, props<{todo: Todo}>()),
    success: createAction(TodoActionNames.EDIT_END_TODO_SUCCESS, props<{todo: Todo}>()),
    failure: createAction(TodoActionNames.EDIT_END_TODO_FAILURE, props<{error: string}>()),
  };

// CLEAR COMPLETED TODO functionality
export const clearCompletedTodoAsync =
  {
    request: createAction(TodoActionNames.CLEAR_COMPLETED_TODO_REQUEST, props<{todos: Todo[]}>()),
    success: createAction(TodoActionNames.CLEAR_COMPLETED_TODO_SUCCESS, props<{todos: Todo[]}>()),
    failure: createAction(TodoActionNames.CLEAR_COMPLETED_TODO_FAILURE, props<{error: string}>()),
  };

// SOCKET NOTIFIED TODO functionality
export const socketNotifiedTodoAsync =
  {
    request: createAction(TodoActionNames.SOCKET_NOTIFIED_TODO_REQUEST, props<{socketType: SocketDataType}>()),
    success: createAction(TodoActionNames.SOCKET_NOTIFIED_TODO_SUCCESS, props<{todo: Todo}>()),
    failure: createAction(TodoActionNames.SOCKET_NOTIFIED_TODO_FAILURE, props<{error: string}>()),
  };
