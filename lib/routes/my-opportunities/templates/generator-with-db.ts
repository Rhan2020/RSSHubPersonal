import type { JobItem } from '../services/fetcher';
import { extractSalary } from '../services/filter';

interface GeneratorOptions {
    title?: string;
    mode?: 'dashboard' | 'global' | 'stats';
    dataForStorage?: any;
}

export function generateHTMLWithDB(
    jobs: JobItem[],
    ideas: JobItem[],
    stats: any,
    options: GeneratorOptions = {}
): string {
    const {
        title = '全球高薪前端机会雷达',
        mode = 'dashboard',
        dataForStorage = null
    } = options;

    const totalSalary = jobs.reduce((sum, job) => {
        const salary = extractSalary(job.title + ' ' + (job.meta || ''));
        return sum + (salary > 0 ? salary : 60000);
    }, 0);
    const avgSalary = jobs.length > 0 ? Math.round(totalSalary / jobs.length / 1000) : 0;

    // 生成工作卡片HTML
    const jobCards = jobs.map(job => {
        const salary = extractSalary(job.title + ' ' + (job.meta || ''));
        const salaryText = salary > 0 ? `💰 $${Math.round(salary/1000)}k/年` : '';
        
        return `
        <div class="job-card">
            <div class="job-header">
                <a href="${job.link}" target="_blank" class="job-title">${job.title}</a>
                ${salaryText ? `<span class="salary-badge">${salaryText}</span>` : ''}
            </div>
            <div class="job-meta">
                <span class="source">📍 ${job.sourceName}</span>
                <span class="region">🌍 ${job.region}</span>
                ${job.author ? `<span class="author">👤 ${job.author}</span>` : ''}
            </div>
            ${job.description ? `<div class="job-desc">${job.description.substring(0, 150)}...</div>` : ''}
        </div>`;
    }).join('');

    // 生成商机卡片HTML
    const ideaCards = ideas.map(idea => `
        <div class="idea-card">
            <div class="idea-header">
                <a href="${idea.link}" target="_blank" class="idea-title">${idea.title}</a>
            </div>
            <div class="idea-meta">
                <span class="source">💡 ${idea.sourceName}</span>
                ${idea.author ? `<span class="author">👤 ${idea.author}</span>` : ''}
            </div>
            ${idea.description ? `<div class="idea-desc">${idea.description.substring(0, 150)}...</div>` : ''}
        </div>
    `).join('');

    return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 20px;
            }
            
            .container {
                max-width: 1400px;
                margin: 0 auto;
            }
            
            header {
                background: rgba(255, 255, 255, 0.95);
                border-radius: 20px;
                padding: 30px;
                margin-bottom: 30px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            }
            
            h1 {
                color: #333;
                font-size: 2.5em;
                margin-bottom: 10px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            
            .subtitle {
                color: #666;
                font-size: 1.1em;
            }
            
            .stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .stat-card {
                background: rgba(255, 255, 255, 0.95);
                border-radius: 15px;
                padding: 20px;
                text-align: center;
                box-shadow: 0 5px 20px rgba(0,0,0,0.1);
                transition: transform 0.3s ease;
            }
            
            .stat-card:hover {
                transform: translateY(-5px);
            }
            
            .stat-number {
                font-size: 2.5em;
                font-weight: bold;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            
            .stat-label {
                color: #666;
                margin-top: 5px;
            }
            
            .db-status {
                background: rgba(255, 255, 255, 0.95);
                border-radius: 10px;
                padding: 15px;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .db-status.success {
                border-left: 4px solid #10b981;
            }
            
            .db-status.error {
                border-left: 4px solid #ef4444;
            }
            
            .db-status.loading {
                border-left: 4px solid #f59e0b;
            }
            
            .db-status.warning {
                border-left: 4px solid #f59e0b;
                background: rgba(251, 191, 36, 0.1);
            }
            
            .content {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
                margin-top: 30px;
            }
            
            @media (max-width: 968px) {
                .content {
                    grid-template-columns: 1fr;
                }
            }
            
            .section {
                background: rgba(255, 255, 255, 0.95);
                border-radius: 20px;
                padding: 25px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            }
            
            .section-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 2px solid #f0f0f0;
            }
            
            .section-title {
                font-size: 1.5em;
                color: #333;
            }
            
            .section-count {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 5px 15px;
                border-radius: 20px;
                font-size: 0.9em;
            }
            
            .job-card, .idea-card {
                background: #f8f9fa;
                border-radius: 12px;
                padding: 15px;
                margin-bottom: 15px;
                transition: all 0.3s ease;
                border: 1px solid transparent;
            }
            
            .job-card:hover, .idea-card:hover {
                background: white;
                border-color: #667eea;
                box-shadow: 0 5px 15px rgba(102, 126, 234, 0.1);
            }
            
            .job-header, .idea-header {
                margin-bottom: 10px;
            }
            
            .job-title, .idea-title {
                color: #333;
                text-decoration: none;
                font-weight: 600;
                font-size: 1.1em;
                display: inline-block;
                margin-right: 10px;
            }
            
            .job-title:hover, .idea-title:hover {
                color: #667eea;
            }
            
            .salary-badge {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                padding: 3px 10px;
                border-radius: 12px;
                font-size: 0.85em;
                font-weight: 500;
            }
            
            .job-meta, .idea-meta {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
                font-size: 0.9em;
                color: #666;
                margin-bottom: 10px;
            }
            
            .job-desc, .idea-desc {
                color: #555;
                font-size: 0.95em;
                line-height: 1.5;
                margin-top: 10px;
                padding-top: 10px;
                border-top: 1px solid #e5e7eb;
            }
            
            .refresh-btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 10px;
                cursor: pointer;
                font-size: 1em;
                transition: opacity 0.3s ease;
            }
            
            .refresh-btn:hover {
                opacity: 0.9;
            }
            
            .loader {
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top-color: white;
                animation: spin 1s ease-in-out infinite;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            .empty-state {
                text-align: center;
                padding: 40px;
                color: #999;
            }
            
            .cards-container {
                max-height: 600px;
                overflow-y: auto;
                padding-right: 10px;
            }
            
            .cards-container::-webkit-scrollbar {
                width: 6px;
            }
            
            .cards-container::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 10px;
            }
            
            .cards-container::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 10px;
            }
            
            .cards-container::-webkit-scrollbar-thumb:hover {
                background: #555;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <header>
                <h1>${title}</h1>
                <p class="subtitle">实时监控全球高薪远程工作机会，月薪$5k+</p>
            </header>
            
            <!-- IndexedDB 状态 -->
            <div id="dbStatus" class="db-status loading">
                <div>
                    <span id="dbMessage">🔄 正在初始化本地数据库...</span>
                    <small id="dbDetails" style="display: block; margin-top: 5px; color: #666;"></small>
                </div>
                <button class="refresh-btn" onclick="refreshData()">
                    <span id="refreshText">刷新数据</span>
                </button>
            </div>
            
            <!-- 统计卡片 -->
            <div class="stats">
                <div class="stat-card">
                    <div class="stat-number">${jobs.length}</div>
                    <div class="stat-label">高薪职位</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${ideas.length}</div>
                    <div class="stat-label">商业机会</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.sources}</div>
                    <div class="stat-label">数据源</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">$${avgSalary}k</div>
                    <div class="stat-label">平均年薪</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="dbTotal">0</div>
                    <div class="stat-label">本地缓存</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="dbNew">0</div>
                    <div class="stat-label">今日新增</div>
                </div>
            </div>
            
            <!-- 内容区域 -->
            <div class="content">
                <!-- 职位列表 -->
                <section class="section">
                    <div class="section-header">
                        <h2 class="section-title">💼 高薪职位</h2>
                        <span class="section-count">${jobs.length} 个</span>
                    </div>
                    <div class="cards-container">
                        ${jobCards || '<div class="empty-state">暂无数据</div>'}
                    </div>
                </section>
                
                <!-- 商机列表 -->
                <section class="section">
                    <div class="section-header">
                        <h2 class="section-title">💡 商业机会</h2>
                        <span class="section-count">${ideas.length} 个</span>
                    </div>
                    <div class="cards-container">
                        ${ideaCards || '<div class="empty-state">暂无数据</div>'}
                    </div>
                </section>
            </div>
        </div>
        
        <!-- IndexedDB 处理脚本 -->
        <script>
            ${dataForStorage ? `const serverData = ${JSON.stringify(dataForStorage)};` : 'const serverData = null;'}
            
            // IndexedDB 管理类
            class OpportunityDB {
                constructor() {
                    this.dbName = 'OpportunityRadar';
                    this.version = 1;
                    this.db = null;
                }
                
                async init() {
                    return new Promise((resolve, reject) => {
                        const request = indexedDB.open(this.dbName, this.version);
                        
                        request.onerror = () => {
                            console.error('Failed to open IndexedDB:', request.error);
                            reject(request.error);
                        };
                        
                        request.onsuccess = () => {
                            this.db = request.result;
                            console.log('IndexedDB initialized');
                            resolve();
                        };
                        
                        request.onupgradeneeded = (event) => {
                            const db = event.target.result;
                            
                            // 创建对象存储
                            if (!db.objectStoreNames.contains('opportunities')) {
                                const store = db.createObjectStore('opportunities', { 
                                    keyPath: 'id', 
                                    autoIncrement: false 
                                });
                                
                                store.createIndex('type', 'type', { unique: false });
                                store.createIndex('sourceName', 'sourceName', { unique: false });
                                store.createIndex('timestamp', 'timestamp', { unique: false });
                                store.createIndex('createdAt', 'createdAt', { unique: false });
                            }
                            
                            if (!db.objectStoreNames.contains('stats')) {
                                db.createObjectStore('stats', { keyPath: 'date' });
                            }
                        };
                    });
                }
                
                generateId(item) {
                    const str = item.link + item.title;
                    let hash = 0;
                    for (let i = 0; i < str.length; i++) {
                        const char = str.charCodeAt(i);
                        hash = ((hash << 5) - hash) + char;
                        hash = hash & hash;
                    }
                    return Math.abs(hash).toString(16);
                }
                
                async saveItems(items) {
                    if (!this.db) await this.init();
                    
                    const now = new Date();
                    const today = now.toISOString().split('T')[0];
                    
                    // 使用Promise包装整个事务操作
                    return new Promise((resolve, reject) => {
                        const transaction = this.db.transaction(['opportunities', 'stats'], 'readwrite');
                        const store = transaction.objectStore('opportunities');
                        const statsStore = transaction.objectStore('stats');
                        
                        let newCount = 0;
                        let updateCount = 0;
                        let processed = 0;
                        const totalItems = items.length;
                        
                        // 如果没有数据，直接完成
                        if (totalItems === 0) {
                            resolve({ newCount: 0, updateCount: 0, total: 0 });
                            return;
                        }
                        
                        // 批量处理数据项
                        for (const item of items) {
                            const dbItem = {
                                ...item,
                                id: this.generateId(item),
                                createdAt: now.toISOString()
                            };
                            
                            // 使用add方法尝试添加新项，如果存在则更新
                            const addRequest = store.add(dbItem);
                            
                            addRequest.onsuccess = () => {
                                newCount++;
                                processed++;
                                
                                // 当所有项处理完成时，更新统计
                                if (processed === totalItems) {
                                    updateStats();
                                }
                            };
                            
                            addRequest.onerror = () => {
                                // 如果添加失败（可能是重复），则尝试更新
                                const getRequest = store.get(dbItem.id);
                                
                                getRequest.onsuccess = () => {
                                    const existing = getRequest.result;
                                    if (existing) {
                                        dbItem.createdAt = existing.createdAt;
                                    }
                                    
                                    const putRequest = store.put(dbItem);
                                    putRequest.onsuccess = () => {
                                        updateCount++;
                                        processed++;
                                        
                                        if (processed === totalItems) {
                                            updateStats();
                                        }
                                    };
                                    
                                    putRequest.onerror = () => {
                                        processed++;
                                        console.error('Failed to update item');
                                        
                                        if (processed === totalItems) {
                                            updateStats();
                                        }
                                    };
                                };
                                
                                getRequest.onerror = () => {
                                    processed++;
                                    console.error('Failed to get item');
                                    
                                    if (processed === totalItems) {
                                        updateStats();
                                    }
                                };
                            };
                        }
                        
                        // 更新统计函数
                        function updateStats() {
                            const statsGetRequest = statsStore.get(today);
                            statsGetRequest.onsuccess = () => {
                                const existingStats = statsGetRequest.result || { 
                                    date: today, 
                                    fetched: 0, 
                                    newItems: 0 
                                };
                                existingStats.fetched += totalItems;
                                existingStats.newItems += newCount;
                                existingStats.lastUpdate = now.toISOString();
                                
                                statsStore.put(existingStats);
                            };
                        }
                        
                        // 事务完成时解决Promise
                        transaction.oncomplete = () => {
                            resolve({ newCount, updateCount, total: totalItems });
                        };
                        
                        transaction.onerror = (e) => {
                            console.error('Transaction error:', e);
                            reject(new Error('Transaction failed: ' + e.target.error));
                        };
                        
                        transaction.onabort = (e) => {
                            console.error('Transaction aborted:', e);
                            reject(new Error('Transaction aborted'));
                        };
                    });
                }
                
                async getTotalCount() {
                    if (!this.db) await this.init();
                    return new Promise((resolve) => {
                        const transaction = this.db.transaction(['opportunities'], 'readonly');
                        const request = transaction.objectStore('opportunities').count();
                        request.onsuccess = () => resolve(request.result);
                        request.onerror = () => resolve(0);
                    });
                }
            }
            
            // 初始化数据库并保存数据
            const db = new OpportunityDB();
            
            async function initializeDB() {
                const statusEl = document.getElementById('dbStatus');
                const messageEl = document.getElementById('dbMessage');
                const detailsEl = document.getElementById('dbDetails');
                const totalEl = document.getElementById('dbTotal');
                const newEl = document.getElementById('dbNew');
                
                try {
                    await db.init();
                    
                    if (serverData && serverData.allItems && serverData.allItems.length > 0) {
                        statusEl.className = 'db-status loading';
                        messageEl.textContent = '💾 正在保存数据到本地...';
                        
                        try {
                            const result = await db.saveItems(serverData.allItems);
                            const total = await db.getTotalCount();
                            
                            statusEl.className = 'db-status success';
                            messageEl.textContent = '✅ 数据已成功缓存到本地';
                            detailsEl.textContent = \`新增 \${result.newCount} 条，更新 \${result.updateCount} 条，共 \${result.total} 条数据\`;
                            
                            totalEl.textContent = total;
                            newEl.textContent = result.newCount;
                        } catch (saveError) {
                            console.error('Error saving items:', saveError);
                            statusEl.className = 'db-status warning';
                            messageEl.textContent = '⚠️ 部分数据保存失败';
                            detailsEl.textContent = saveError.message;
                        }
                    } else {
                        const total = await db.getTotalCount();
                        statusEl.className = 'db-status success';
                        messageEl.textContent = '✅ 本地数据库就绪';
                        detailsEl.textContent = \`已缓存 \${total} 条数据\`;
                        totalEl.textContent = total;
                    }
                } catch (error) {
                    statusEl.className = 'db-status error';
                    messageEl.textContent = '❌ 数据库初始化失败';
                    detailsEl.textContent = error.message;
                    console.error('DB initialization failed:', error);
                }
            }
            
            function refreshData() {
                window.location.reload();
            }
            
            // 页面加载时初始化
            window.addEventListener('load', () => {
                initializeDB();
            });
        </script>
    </body>
    </html>
    `;
}
