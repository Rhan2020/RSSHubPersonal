/**
 * 统一的缓存和错误处理工具
 */
import cache from '@/utils/cache';

// 统一的缓存配置
export const CACHE_CONFIG = {
    // 默认缓存时间（秒）
    DEFAULT_TTL: 600, // 10分钟
    // 短期缓存（用于频繁更新的数据源）
    SHORT_TTL: 300, // 5分钟
    // 长期缓存（用于稳定的数据源）
    LONG_TTL: 1800, // 30分钟
    // 缓存键前缀
    PREFIX: 'opportunity',
    // 版本号（用于缓存失效）
    VERSION: 'v2',
};

/**
 * 生成统一的缓存键
 */
export function getCacheKey(sourceName: string, suffix?: string): string {
    const base = `${CACHE_CONFIG.PREFIX}:${sourceName}:${CACHE_CONFIG.VERSION}`;
    return suffix ? `${base}:${suffix}` : base;
}

/**
 * 从缓存获取数据
 */
export async function getFromCache<T>(key: string): Promise<T | null> {
    try {
        const cached = await cache.get(key);
        return cached as T | null;
    } catch {
        return null;
    }
}

/**
 * 设置缓存数据
 */
export async function setToCache<T>(key: string, data: T, ttl: number = CACHE_CONFIG.DEFAULT_TTL): Promise<void> {
    try {
        await cache.set(key, data, ttl);
    } catch {
        // Ignore cache set errors
    }
}

/**
 * 统一的错误类型
 */
export class FetchError extends Error {
    public readonly sourceName: string;
    public readonly statusCode?: number;
    public readonly isTimeout: boolean;
    public readonly isNetworkError: boolean;

    constructor(
        message: string,
        sourceName: string,
        options?: {
            statusCode?: number;
            isTimeout?: boolean;
            isNetworkError?: boolean;
        }
    ) {
        super(message);
        this.name = 'FetchError';
        this.sourceName = sourceName;
        this.statusCode = options?.statusCode;
        this.isTimeout = options?.isTimeout ?? false;
        this.isNetworkError = options?.isNetworkError ?? false;
    }
}

/**
 * 统一的错误处理函数
 */
export function handleFetchError(error: unknown, sourceName: string): FetchError {
    if (error instanceof FetchError) {
        return error;
    }

    const err = error as Error & { code?: string; response?: { statusCode?: number } };
    const message = err.message || 'Unknown error';

    // 检测超时错误
    const isTimeout = message.includes('timeout') || message.includes('ETIMEDOUT') || err.code === 'ETIMEDOUT';

    // 检测网络错误
    const isNetworkError = message.includes('ECONNREFUSED') || message.includes('ENOTFOUND') || message.includes('network') || err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND';

    return new FetchError(message, sourceName, {
        statusCode: err.response?.statusCode,
        isTimeout,
        isNetworkError,
    });
}

/**
 * 带重试的抓取函数包装器
 */
export function withRetry<T>(
    fn: () => Promise<T>,
    options: {
        maxRetries?: number;
        retryDelay?: number;
        sourceName: string;
    }
): Promise<T> {
    const { maxRetries = 2, retryDelay = 1000, sourceName } = options;
    let lastError: Error | null = null;

    const attemptFn = async (attempt: number): Promise<T> => {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;

            // 如果是最后一次尝试，不再重试
            if (attempt === maxRetries) {
                throw handleFetchError(lastError, sourceName);
            }

            // 某些错误不值得重试
            const fetchError = handleFetchError(error, sourceName);
            if (fetchError.statusCode === 404 || fetchError.statusCode === 403) {
                throw fetchError;
            }

            // 等待后重试
            await new Promise((resolve) => setTimeout(resolve, retryDelay * (attempt + 1)));
            return attemptFn(attempt + 1);
        }
    };

    return attemptFn(0);
}

/**
 * 带缓存的抓取函数包装器
 */
export async function withCache<T>(
    fn: () => Promise<T>,
    options: {
        cacheKey: string;
        ttl?: number;
        forceRefresh?: boolean;
    }
): Promise<T> {
    const { cacheKey, ttl = CACHE_CONFIG.DEFAULT_TTL, forceRefresh = false } = options;

    // 尝试从缓存获取
    if (!forceRefresh) {
        const cached = await getFromCache<T>(cacheKey);
        if (cached !== null) {
            return cached;
        }
    }

    // 执行抓取
    const result = await fn();

    // 存入缓存
    if (result !== null && result !== undefined) {
        await setToCache(cacheKey, result, ttl);
    }

    return result;
}

/**
 * 统一的请求头配置
 */
export const DEFAULT_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
};

/**
 * 获取请求配置
 */
export function getRequestConfig(timeout: number = 15000) {
    return {
        timeout,
        headers: DEFAULT_HEADERS,
        retry: {
            limit: 0, // 我们自己处理重试
        },
    };
}

/**
 * 日志工具
 */
export const logger = {
    info: (_message: string, ..._args: unknown[]) => {
        // Logging disabled for production
    },
    warn: (_message: string, ..._args: unknown[]) => {
        // Logging disabled for production
    },
    error: (_message: string, ..._args: unknown[]) => {
        // Logging disabled for production
    },
    debug: (_message: string, ..._args: unknown[]) => {
        // Logging disabled for production
    },
};

/**
 * 批量处理工具 - 分批并发执行
 */
export async function batchProcess<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    options: {
        batchSize?: number;
        onProgress?: (completed: number, total: number) => void;
    } = {}
): Promise<R[]> {
    const { batchSize = 10, onProgress } = options;
    const results: R[] = [];
    const batches: T[][] = [];

    for (let i = 0; i < items.length; i += batchSize) {
        batches.push(items.slice(i, i + batchSize));
    }

    let completed = 0;
    const batchPromises = batches.map(async (batch, batchIndex) => {
        const batchResults = await Promise.allSettled(batch.map((item) => processor(item)));
        const batchItems: R[] = [];
        for (const result of batchResults) {
            if (result.status === 'fulfilled') {
                batchItems.push(result.value);
            }
        }
        completed = Math.min((batchIndex + 1) * batchSize, items.length);
        if (onProgress) {
            onProgress(completed, items.length);
        }
        return batchItems;
    });

    const allBatchResults = await Promise.all(batchPromises);
    for (const batchItems of allBatchResults) {
        results.push(...batchItems);
    }

    return results;
}
