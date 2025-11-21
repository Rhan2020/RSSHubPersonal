// HTML转义函数
export function escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// 格式化日期
export function formatDate(timestamp: string | Date): string {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return '刚刚';
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前`;
    
    return date.toLocaleDateString('zh-CN');
}

// 格式化薪资
export function formatSalary(amount: number): string {
    if (!amount) return '';
    
    if (amount >= 1000000) {
        return `$${Math.floor(amount / 1000)}k`;
    } else if (amount >= 1000) {
        return `$${amount / 1000}k`;
    } else {
        return `$${amount}`;
    }
}

// 截断文本
export function truncateText(text: string, maxLength = 150): string {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// 解析URL参数
export function parseQueryString(query: string): Record<string, string> {
    const params: Record<string, string> = {};
    const pairs = query.replace('?', '').split('&');
    
    for (const pair of pairs) {
        const [key, value] = pair.split('=');
        if (key) {
            params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        }
    }
    
    return params;
}

// 构建URL参数
export function buildQueryString(params: Record<string, any>): string {
    const pairs = Object.entries(params)
        .filter(([_, value]) => value !== null && value !== undefined && value !== '')
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    
    return pairs.length > 0 ? '?' + pairs.join('&') : '';
}

// 获取域名
export function getDomain(url: string): string {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace('www.', '');
    } catch {
        return '';
    }
}

// 生成唯一ID
export function generateId(): string {
    return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

// 批处理数组
export async function batchProcess<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    batchSize = 10,
    delay = 0
): Promise<R[]> {
    const results: R[] = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchResults = await Promise.allSettled(batch.map(processor));
        
        for (const result of batchResults) {
            if (result.status === 'fulfilled') {
                results.push(result.value);
            }
        }
        
        // 延迟以避免过载
        if (delay > 0 && i + batchSize < items.length) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    
    return results;
}

// 重试函数
export async function retry<T>(
    fn: () => Promise<T>,
    maxAttempts = 3,
    delay = 1000
): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;
            
            if (attempt < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, delay * attempt));
            }
        }
    }
    
    throw lastError!;
}

// 缓存键生成
export function getCacheKey(...parts: string[]): string {
    return parts.filter(Boolean).join(':');
}

// 验证邮箱
export function isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// 验证URL
export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// 合并去重数组
export function mergeUnique<T>(arr1: T[], arr2: T[], key?: keyof T): T[] {
    if (!key) {
        return [...new Set([...arr1, ...arr2])];
    }
    
    const map = new Map<any, T>();
    [...arr1, ...arr2].forEach(item => {
        map.set(item[key], item);
    });
    
    return Array.from(map.values());
}

// 分组数据
export function groupBy<T>(items: T[], key: keyof T): Record<string, T[]> {
    return items.reduce((groups, item) => {
        const groupKey = String(item[key]);
        if (!groups[groupKey]) {
            groups[groupKey] = [];
        }
        groups[groupKey].push(item);
        return groups;
    }, {} as Record<string, T[]>);
}

// 统计数据
export interface Statistics {
    total: number;
    byType: Record<string, number>;
    byRegion: Record<string, number>;
    bySource: Record<string, number>;
    averageSalary: number;
    maxSalary: number;
    minSalary: number;
}

export function calculateStatistics(items: any[]): Statistics {
    const stats: Statistics = {
        total: items.length,
        byType: {},
        byRegion: {},
        bySource: {},
        averageSalary: 0,
        maxSalary: 0,
        minSalary: Infinity
    };
    
    let totalSalary = 0;
    let salaryCount = 0;
    
    items.forEach(item => {
        // 按类型统计
        stats.byType[item.type] = (stats.byType[item.type] || 0) + 1;
        
        // 按地区统计
        stats.byRegion[item.region] = (stats.byRegion[item.region] || 0) + 1;
        
        // 按来源统计
        stats.bySource[item.sourceName] = (stats.bySource[item.sourceName] || 0) + 1;
        
        // 薪资统计
        if (item.salary) {
            const salary = parseInt(item.salary.replace(/[^\d]/g, ''));
            if (salary) {
                totalSalary += salary;
                salaryCount++;
                stats.maxSalary = Math.max(stats.maxSalary, salary);
                stats.minSalary = Math.min(stats.minSalary, salary);
            }
        }
    });
    
    if (salaryCount > 0) {
        stats.averageSalary = Math.round(totalSalary / salaryCount);
    }
    
    if (stats.minSalary === Infinity) {
        stats.minSalary = 0;
    }
    
    return stats;
}
