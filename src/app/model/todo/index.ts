import Todo, {IDType, OnOFF} from './todo.model';
import FilterType from './todo.filter.names'
import SocketType, {DELETE_TODO, INSERT_TODO, UPDATE_TODO} from './todo.socket.type';

export function toBoolean(value: OnOFF) : boolean {
    if (value === 'on') {
        return true;
    }
    else {
        return false
    }
}

export type SocketDataType = {
  type: SocketType,
  id: IDType
}

export {TodoState} from './todo.state.model';
export type {Todo, IDType, SocketType, OnOFF};
export {DELETE_TODO, INSERT_TODO, UPDATE_TODO};
export {type FilterType};
