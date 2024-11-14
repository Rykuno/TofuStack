export interface RedisRepository<T> {
  get(key: string): Promise<T | null>;
  set(value: T): Promise<void>;
  delete(key: string): Promise<void>;
}
