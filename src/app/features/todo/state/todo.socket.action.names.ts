export const INSERT_TODO = 'insert';
export const UPDATE_TODO = 'update';
export const DELETE_TODO = 'delete';

type SocketType = typeof INSERT_TODO | typeof UPDATE_TODO | typeof DELETE_TODO
export default SocketType
