import   Todo, {IDType, OnOFF} from './todo.model';

export function toBoolean(value: OnOFF) : boolean {
    if (value === 'on') {
        return true;
    }
    else {
        return false
    }
}

export type {Todo, IDType, OnOFF};
