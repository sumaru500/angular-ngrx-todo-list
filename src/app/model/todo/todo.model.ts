export type OnOFF = 'on' | 'off';
export type IDType = string | number | undefined;

export default interface Todo {
  id?: IDType;
  title?: string;
  completed?: boolean
}
