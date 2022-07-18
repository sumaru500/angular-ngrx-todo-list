import { TodoFilterNames } from "../constants"
import { Todo } from "~model/todo";
const filters = {
    [TodoFilterNames.ALL]: function (todo: Todo)  {return true},
    [TodoFilterNames.ACTIVE]: function (todo: Todo) {return !todo.completed},
    [TodoFilterNames.COMPLETED]: function (todo: Todo) {return todo.completed},
}

export default filters;
