import { createSelector } from "@ngrx/store";
import { State } from "~model";
import { TodoState } from "~model/todo";

// all selectors are used in UI components to listen the change on store to rerender UI

export const selectTodoState = (state: State) => state.todo

export const selectAllTodos = createSelector(
  selectTodoState,
  (state: TodoState) => state.todos
);

export const selectFilter = createSelector(
  selectTodoState,
  (state: TodoState) => state.filter
);

export const selectStatusFetch = createSelector(
  selectTodoState,
  (state: TodoState) => state.statusFetch
);

export const selectStatusAdd = createSelector(
  selectTodoState,
  (state: TodoState) => state.statusAdd
);
export const selectStatusRemove = createSelector(
  selectTodoState,
  (state: TodoState) => state.statusRemove
);

export const selectStatusToggle = createSelector(
  selectTodoState,
  (state: TodoState) => state.statusToggle
);

export const selectStatusToggleAll = createSelector(
  selectTodoState,
  (state: TodoState) => state.statusToggleAll
);

export const selectStatusEditEnd = createSelector(
  selectTodoState,
  (state: TodoState) => state.statusEditEnd
);

export const selectStatusClearCompleted = createSelector(
  selectTodoState,
  (state: TodoState) => state.statusClearCompleted
);

