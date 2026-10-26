import Redis from 'ioredis';

// Client Redis singleton avec fallback mock pour développement
class RedisClient {
  private client: Redis | null = null;
  private mockStore: Map<string, { value: string; expiry?: number }> = new Map();
  private useMock: boolean = false;

  constructor() {
    const redisUrl = process.env.REDIS_URL;
    
    if (redisUrl && redisUrl.trim() !== '') {
      try {
        this.client = new Redis(redisUrl, {
          maxRetriesPerRequest: 3,
          retryStrategy(times) {
            const delay = Math.min(times * 50, 2000);
            return delay;
          },
        });

        this.client.on('error', (err) => {
          console.error('Redis Client Error:', err);
          console.warn('Falling back to mock Redis client');
          this.useMock = true;
        });

        this.client.on('connect', () => {
          console.log('Redis connected successfully');
          this.useMock = false;
        });
      } catch (error) {
        console.error('Failed to initialize Redis:', error);
        this.useMock = true;
      }
    } else {
      console.warn('No REDIS_URL provided, using mock Redis client for development');
      this.useMock = true;
    }
  }

  async get(key: string): Promise<string | null> {
    if (this.useMock || !this.client) {
      const entry = this.mockStore.get(key);
      if (!entry) return null;
      if (entry.expiry && Date.now() > entry.expiry) {
        this.mockStore.delete(key);
        return null;
      }
      return entry.value;
    }

    try {
      return await this.client.get(key);
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  async set(key: string, value: string, expirySeconds?: number): Promise<void> {
    if (this.useMock || !this.client) {
      const expiry = expirySeconds ? Date.now() + expirySeconds * 1000 : undefined;
      this.mockStore.set(key, { value, expiry });
      return;
    }

    try {
      if (expirySeconds) {
        await this.client.setex(key, expirySeconds, value);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      console.error('Redis SET error:', error);
    }
  }

  async incr(key: string): Promise<number> {
    if (this.useMock || !this.client) {
      const entry = this.mockStore.get(key);
      const currentValue = entry ? parseInt(entry.value, 10) : 0;
      const newValue = currentValue + 1;
      this.mockStore.set(key, { value: newValue.toString(), expiry: entry?.expiry });
      return newValue;
    }

    try {
      return await this.client.incr(key);
    } catch (error) {
      console.error('Redis INCR error:', error);
      return 0;
    }
  }

  async expire(key: string, seconds: number): Promise<void> {
    if (this.useMock || !this.client) {
      const entry = this.mockStore.get(key);
      if (entry) {
        entry.expiry = Date.now() + seconds * 1000;
      }
      return;
    }

    try {
      await this.client.expire(key, seconds);
    } catch (error) {
      console.error('Redis EXPIRE error:', error);
    }
  }

  async ttl(key: string): Promise<number> {
    if (this.useMock || !this.client) {
      const entry = this.mockStore.get(key);
      if (!entry || !entry.expiry) return -1;
      const remaining = Math.ceil((entry.expiry - Date.now()) / 1000);
      return remaining > 0 ? remaining : -2;
    }

    try {
      return await this.client.ttl(key);
    } catch (error) {
      console.error('Redis TTL error:', error);
      return -1;
    }
  }

  async del(key: string): Promise<void> {
    if (this.useMock || !this.client) {
      this.mockStore.delete(key);
      return;
    }

    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Redis DEL error:', error);
    }
  }

  isUsingMock(): boolean {
    return this.useMock;
  }
}

// Export singleton instance
export const redis = new RedisClient();
export default redis;
