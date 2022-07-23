type AsyncStatus = 'pending' | 'loading' | 'error' | 'success';
type Status = {
  error: string,
  status: AsyncStatus,
}
export type {AsyncStatus, Status};
