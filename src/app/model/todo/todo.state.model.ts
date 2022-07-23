import { Status } from "../common/async.status";
import FilterType from "./todo.filter.names";
import Todo from "./todo.model";

export interface TodoState {
  // feature state
  todos: Todo[],
  filter: FilterType,

  // async status
  // FETCH TODO
  statusFetch: Status,

  // ADD TODO
  statusAdd: Status,

  // REMOVE TODO
  statusRemove: Status,

  // TOGGLE TODO
  statusToggle: Status,

  // TOGGLE ALL TODOS
  statusToggleAll: Status,

  // EDIT END TODO
  statusEditEnd: Status,

  // CLEAR COMPLETED TODOS
  statusClearCompleted: Status,

}
