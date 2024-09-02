export interface Config {
  isProduction: boolean;
  api: ApiConfig;
  storage: StorageConfig;
  redis: RedisConfig;
  postgres: PostgresConfig;
}

interface ApiConfig {
  origin: string;
}

interface StorageConfig {
  accessKey: string;
  secretKey: string;
  bucket: string;
  url: string;
}

interface RedisConfig {
  url: string;
}

interface PostgresConfig {
  url: string;
}