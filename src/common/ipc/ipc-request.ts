export interface IpcRequest<T> {
  id: number;
  path: string;
  data?: T;
}
