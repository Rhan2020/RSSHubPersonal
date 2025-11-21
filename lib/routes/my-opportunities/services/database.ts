// IndexedDB 数据库操作模块
import type { JobItem } from './fetcher';

interface DBJobItem extends JobItem {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    viewed?: boolean;
    starred?: boolean;
}

class OpportunityDatabase {
    private dbName = 'OpportunityRadar';
    private version = 1;
    private db: IDBDatabase | null = null;
    
    // 初始化数据库
    async init(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            
            request.onerror = () => {
                console.error('Failed to open IndexedDB:', request.error);
                reject(request.error);
            };
            
            request.onsuccess = () => {
                this.db = request.result;
                console.log('IndexedDB initialized successfully');
                resolve();
            };
            
            request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                const db = (event.target as IDBOpenDBRequest).result;
                
                // 创建jobs表
                if (!db.objectStoreNames.contains('jobs')) {
                    const jobStore = db.createObjectStore('jobs', { 
                        keyPath: 'id', 
                        autoIncrement: false 
                    });
                    
                    // 创建索引
                    jobStore.createIndex('sourceName', 'sourceName', { unique: false });
                    jobStore.createIndex('type', 'type', { unique: false });
                    jobStore.createIndex('region', 'region', { unique: false });
                    jobStore.createIndex('timestamp', 'timestamp', { unique: false });
                    jobStore.createIndex('createdAt', 'createdAt', { unique: false });
                    jobStore.createIndex('starred', 'starred', { unique: false });
                }
                
                // 创建ideas表
                if (!db.objectStoreNames.contains('ideas')) {
                    const ideaStore = db.createObjectStore('ideas', { 
                        keyPath: 'id', 
                        autoIncrement: false 
                    });
                    
                    ideaStore.createIndex('sourceName', 'sourceName', { unique: false });
                    ideaStore.createIndex('timestamp', 'timestamp', { unique: false });
                    ideaStore.createIndex('createdAt', 'createdAt', { unique: false });
                    ideaStore.createIndex('starred', 'starred', { unique: false });
                }
                
                // 创建统计表
                if (!db.objectStoreNames.contains('stats')) {
                    db.createObjectStore('stats', { keyPath: 'date' });
                }
                
                console.log('IndexedDB schema created');
            };
        });
    }
    
    // 生成唯一ID
    private generateId(item: JobItem): string {
        // 使用链接和标题生成唯一ID
        const str = item.link + item.title;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(16);
    }
    
    // 批量保存数据
    async saveItems(items: JobItem[]): Promise<number> {
        if (!this.db) {
            await this.init();
        }
        
        let savedCount = 0;
        const jobs: DBJobItem[] = [];
        const ideas: DBJobItem[] = [];
        const now = new Date();
        
        // 分类数据
        items.forEach(item => {
            const dbItem: DBJobItem = {
                ...item,
                id: this.generateId(item),
                createdAt: now,
                updatedAt: now,
                viewed: false,
                starred: false
            };
            
            if (item.type === 'job') {
                jobs.push(dbItem);
            } else {
                ideas.push(dbItem);
            }
        });
        
        // 保存到数据库
        const transaction = this.db!.transaction(['jobs', 'ideas'], 'readwrite');
        
        // 保存jobs
        if (jobs.length > 0) {
            const jobStore = transaction.objectStore('jobs');
            for (const job of jobs) {
                try {
                    // 先检查是否存在
                    const existingRequest = jobStore.get(job.id!);
                    await new Promise((resolve) => {
                        existingRequest.onsuccess = () => {
                            const existing = existingRequest.result;
                            if (!existing) {
                                // 不存在则添加
                                jobStore.add(job);
                                savedCount++;
                            } else {
                                // 存在则更新
                                job.createdAt = existing.createdAt;
                                jobStore.put(job);
                            }
                            resolve(null);
                        };
                        existingRequest.onerror = () => resolve(null);
                    });
                } catch (error) {
                    console.error('Failed to save job:', error);
                }
            }
        }
        
        // 保存ideas
        if (ideas.length > 0) {
            const ideaStore = transaction.objectStore('ideas');
            for (const idea of ideas) {
                try {
                    const existingRequest = ideaStore.get(idea.id!);
                    await new Promise((resolve) => {
                        existingRequest.onsuccess = () => {
                            const existing = existingRequest.result;
                            if (!existing) {
                                ideaStore.add(idea);
                                savedCount++;
                            } else {
                                idea.createdAt = existing.createdAt;
                                ideaStore.put(idea);
                            }
                            resolve(null);
                        };
                        existingRequest.onerror = () => resolve(null);
                    });
                } catch (error) {
                    console.error('Failed to save idea:', error);
                }
            }
        }
        
        await new Promise((resolve) => {
            transaction.oncomplete = () => resolve(null);
        });
        
        console.log(`Saved ${savedCount} new items to IndexedDB`);
        
        // 更新统计
        await this.updateStats(items.length, savedCount);
        
        return savedCount;
    }
    
    // 获取数据
    async getItems(type: 'job' | 'idea' | 'all', limit: number = 100): Promise<DBJobItem[]> {
        if (!this.db) {
            await this.init();
        }
        
        const items: DBJobItem[] = [];
        const stores = type === 'all' ? ['jobs', 'ideas'] : [type === 'job' ? 'jobs' : 'ideas'];
        
        for (const storeName of stores) {
            const transaction = this.db!.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const index = store.index('createdAt');
            
            // 按创建时间倒序获取
            const request = index.openCursor(null, 'prev');
            
            await new Promise((resolve) => {
                let count = 0;
                request.onsuccess = (event) => {
                    const cursor = (event.target as IDBRequest).result;
                    if (cursor && count < limit) {
                        items.push(cursor.value);
                        count++;
                        cursor.continue();
                    } else {
                        resolve(null);
                    }
                };
                request.onerror = () => resolve(null);
            });
        }
        
        return items;
    }
    
    // 获取统计信息
    async getStats(): Promise<any> {
        if (!this.db) {
            await this.init();
        }
        
        const transaction = this.db!.transaction(['jobs', 'ideas', 'stats'], 'readonly');
        
        // 统计jobs
        const jobStore = transaction.objectStore('jobs');
        const jobCount = await new Promise<number>((resolve) => {
            const request = jobStore.count();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => resolve(0);
        });
        
        // 统计ideas
        const ideaStore = transaction.objectStore('ideas');
        const ideaCount = await new Promise<number>((resolve) => {
            const request = ideaStore.count();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => resolve(0);
        });
        
        // 获取今日统计
        const statsStore = transaction.objectStore('stats');
        const today = new Date().toISOString().split('T')[0];
        const todayStats = await new Promise<any>((resolve) => {
            const request = statsStore.get(today);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => resolve(null);
        });
        
        return {
            totalJobs: jobCount,
            totalIdeas: ideaCount,
            total: jobCount + ideaCount,
            todayFetched: todayStats?.fetched || 0,
            todayNew: todayStats?.newItems || 0,
            lastUpdate: todayStats?.lastUpdate || null
        };
    }
    
    // 更新统计
    private async updateStats(fetched: number, newItems: number): Promise<void> {
        const transaction = this.db!.transaction(['stats'], 'readwrite');
        const store = transaction.objectStore('stats');
        const today = new Date().toISOString().split('T')[0];
        
        const existingRequest = store.get(today);
        await new Promise((resolve) => {
            existingRequest.onsuccess = () => {
                const existing = existingRequest.result || { date: today, fetched: 0, newItems: 0 };
                existing.fetched += fetched;
                existing.newItems += newItems;
                existing.lastUpdate = new Date().toISOString();
                store.put(existing);
                resolve(null);
            };
            existingRequest.onerror = () => resolve(null);
        });
    }
    
    // 清理旧数据（保留最近30天）
    async cleanOldData(daysToKeep: number = 30): Promise<number> {
        if (!this.db) {
            await this.init();
        }
        
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        
        let deletedCount = 0;
        const transaction = this.db!.transaction(['jobs', 'ideas'], 'readwrite');
        
        // 清理jobs
        const jobStore = transaction.objectStore('jobs');
        const jobIndex = jobStore.index('createdAt');
        const jobRequest = jobIndex.openCursor(IDBKeyRange.upperBound(cutoffDate));
        
        await new Promise((resolve) => {
            jobRequest.onsuccess = (event) => {
                const cursor = (event.target as IDBRequest).result;
                if (cursor) {
                    if (!cursor.value.starred) { // 不删除标星的
                        cursor.delete();
                        deletedCount++;
                    }
                    cursor.continue();
                } else {
                    resolve(null);
                }
            };
            jobRequest.onerror = () => resolve(null);
        });
        
        // 清理ideas
        const ideaStore = transaction.objectStore('ideas');
        const ideaIndex = ideaStore.index('createdAt');
        const ideaRequest = ideaIndex.openCursor(IDBKeyRange.upperBound(cutoffDate));
        
        await new Promise((resolve) => {
            ideaRequest.onsuccess = (event) => {
                const cursor = (event.target as IDBRequest).result;
                if (cursor) {
                    if (!cursor.value.starred) {
                        cursor.delete();
                        deletedCount++;
                    }
                    cursor.continue();
                } else {
                    resolve(null);
                }
            };
            ideaRequest.onerror = () => resolve(null);
        });
        
        console.log(`Cleaned ${deletedCount} old items from IndexedDB`);
        return deletedCount;
    }
}

// 导出单例
export const opportunityDB = new OpportunityDatabase();

// 导出类型
export type { DBJobItem };
