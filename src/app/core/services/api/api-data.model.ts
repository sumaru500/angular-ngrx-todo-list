export interface APIData<T> {
  data: T;
  error?: {
    message: string;
    code?: number;
    errors?: string[];
  };
}
