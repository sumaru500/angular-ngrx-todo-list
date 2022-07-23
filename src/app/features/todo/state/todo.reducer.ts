import {createReducer, combineReducers, on } from "@ngrx/store";
import * as _ from "lodash";
import { IDType, Todo, TodoState } from "~model/todo/";
import * as todoActions from "./todo.actions";
import  * as TodoFilterNames from "~model/todo/todo.filter.names";
import FilterType from "~model/todo/todo.filter.names";
import { Status } from "~model/common/async.status";

// ------------------------SYNC actions----------------------------------------------------//

const filter = createReducer(TodoFilterNames.ALL as FilterType,
    on(todoActions.filterTodo, (state : FilterType, {filter}) => {return filter} )
  )

// ------------------------ASYNC actions----------------------------------------------------//

const statusFetch = createReducer({error : '', status: 'pending'} as Status,
    on(todoActions.fetchTodoAsync.request, (state, {}) => {return {...state, status: 'loading'}}),
    on(todoActions.fetchTodoAsync.success, (state, {}) => {return {...state, status: 'success'}}),
    on(todoActions.fetchTodoAsync.failure, (state, {error}) => {return {...state, error: error, status: 'error'}}),
  )
const statusAdd = createReducer({error : '', status: 'pending'} as Status,
    on(todoActions.addTodoAsync.request, (state, {}) => {return {...state, status: 'loading'}}),
    on(todoActions.addTodoAsync.success, (state, {}) => {return {...state, status: 'success'}}),
    on(todoActions.addTodoAsync.failure, (state, {error}) => {return {...state, error: error, status: 'error'}}),
  )
const statusRemove = createReducer({error : '', status: 'pending'} as Status,
    on(todoActions.removeTodoAsync.request, (state, {}) => {return {...state, status: 'loading'}}),
    on(todoActions.removeTodoAsync.success, (state, {}) => {return {...state, status: 'success'}}),
    on(todoActions.removeTodoAsync.failure, (state, {error}) => {return {...state, error: error, status: 'error'}}),
  )
const statusToggle = createReducer({error : '', status: 'pending'} as Status,
    on(todoActions.toggleTodoAsync.request, (state, {}) => {return {...state, status: 'loading'}}),
    on(todoActions.toggleTodoAsync.success, (state, {}) => {return {...state, status: 'success'}}),
    on(todoActions.toggleTodoAsync.failure, (state, {error}) => {return {...state, error: error, status: 'error'}}),
  )
const statusToggleAll = createReducer({error : '', status: 'pending'} as Status,
    on(todoActions.toggleAllTodoAsync.request, (state, {}) => {return {...state, status: 'loading'}}),
    on(todoActions.toggleAllTodoAsync.success, (state, {}) => {return {...state, status: 'success'}}),
    on(todoActions.toggleAllTodoAsync.failure, (state, {error}) => {return {...state, error: error, status: 'error'}}),
  )
const statusEditEnd = createReducer({error : '', status: 'pending'} as Status,
    on(todoActions.editEndTodoAsync.request, (state, {}) => {return {...state, status: 'loading'}}),
    on(todoActions.editEndTodoAsync.success, (state, {}) => {return {...state, status: 'success'}}),
    on(todoActions.editEndTodoAsync.failure, (state, {error}) => {return {...state, error: error, status: 'error'}}),
  )
const statusClearCompleted = createReducer({error : '', status: 'pending'} as Status,
    on(todoActions.clearCompletedTodoAsync.request, (state, {}) => {return {...state, status: 'loading'}}),
    on(todoActions.clearCompletedTodoAsync.success, (state, {}) => {return {...state, status: 'success'}}),
    on(todoActions.clearCompletedTodoAsync.failure, (state, {error}) => {return {...state, error: error, status: 'error'}}),
  )

 // ------------------------------ASYNC success----------------------------------//
const todos = createReducer([] as Todo[],
    on(todoActions.fetchTodoAsync.success, (state, {todos}) => {return [...todos]}),
    on(todoActions.addTodoAsync.success, (state, {todo}) => {return [...state, todo]}),
    on(todoActions.removeTodoAsync.success, (state, {todo: origin}) => {return state.filter(todo => todo.id !== origin.id)}),
    on(todoActions.toggleTodoAsync.success, (state, {todo: origin}) => {
      state = _.cloneDeep(state);
      const index = state.findIndex((todo, idx) => todo.id === origin.id);
      state[index].completed = origin.completed;
      return state;
    }),
    on(todoActions.toggleAllTodoAsync.success, (state, {todos}) => {
      state = _.cloneDeep(state);
      state.forEach(todo => {
        const payloadTodo = todos.find((payloadTodo) => payloadTodo.id === todo.id)
        Object.assign(todo, payloadTodo);
    })
    return state;
    }),
    on(todoActions.editEndTodoAsync.success, (state, {todo: origin}) => {
      state = _.cloneDeep(state);
      const index = state.findIndex((todo, idx) => todo.id === origin.id);
      state.splice(index, 1, {...state[index], title: origin.title})
      // state[index].title = origin.title;
      return state;
    }),
    on(todoActions.clearCompletedTodoAsync.success, (state, {todos}) => {
      const ids : IDType[] = todos.map((todo: Todo) => todo.id);
      return state.filter(todo => !ids.includes(todo.id));
    }),
    on(todoActions.socketNotifiedTodoAsync.success, (state, {todo: origin}) => {
      const index = state.findIndex(todo => todo.id === origin.id);
      if (index === -1) { // ADD a new todo
          return [...state, origin]
      }
      else { // UPDATE an existing todo
          state = _.cloneDeep(state);
          console.log(index, origin);
          state.splice(index, 1, {...state[index], title: origin.title, completed: origin.completed})
          // state[index].title = origin.title;
          // state[index].completed = origin.completed;
          return state;
      }
    }),
    on(todoActions.deleteTodo,(state, {todo: origin}) => {return state.filter(todo => todo.id !== origin.id)})
  )

  // ------------------------Combine reducers --------------------//

  export const todoReducer = combineReducers( {
    filter,
    todos,
    statusFetch,
    statusAdd,
    statusRemove,
    statusToggle,
    statusToggleAll,
    statusEditEnd,
    statusClearCompleted
  });

  export default todoReducer;



