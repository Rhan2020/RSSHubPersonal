import type { JobItem } from './fetcher';
import {
    highSalaryKeywords,
    frontendKeywords,
    remoteKeywords,
    painPointKeywords,
    excludeKeywords
} from '../config/keywords';

export interface FilterResult {
    highValueJobs: JobItem[];
    potentialIdeas: JobItem[];
}

// 主筛选函数
export function filterItems(items: JobItem[]): FilterResult {
    const highValueJobs = items.filter(item => isHighValueJob(item));
    const potentialIdeas = items.filter(item => isPotentialIdea(item));
    
    return { highValueJobs, potentialIdeas };
}

// 判断是否是高价值工作
function isHighValueJob(item: JobItem): boolean {
    if (item.type !== 'job') return false;
    
    const text = combineText(item).toLowerCase();
    
    // 检查是否包含排除关键词（放宽：只在标题中检查）
    if (hasExcludeKeywords(item.title.toLowerCase())) return false;
    
    // 检查是否包含前端相关关键词（放宽：任何技术相关即可）
    const isFrontend = frontendKeywords.some(k => text.includes(k.toLowerCase()));
    const isTech = text.includes('tech') || text.includes('software') || text.includes('developer') || 
                   text.includes('engineer') || text.includes('programming') || text.includes('code');
    
    // 提取薪资
    const salary = extractSalary(text);
    const hasGoodSalary = salary >= 40000; // 年薪4万美元起（月薪3.3k）- 更宽松的标准
    
    // 检查是否包含高薪关键词
    const hasHighSalaryKeyword = highSalaryKeywords.some(k => text.includes(k.toLowerCase()));
    
    // 某些平台默认都是远程的
    const isRemotePlatform = isDefaultRemotePlatform(item.sourceName);
    
    // 检查是否包含远程关键词
    const hasRemote = isRemotePlatform || 
        remoteKeywords.some(k => text.includes(k.toLowerCase()));
    
    // 来自高薪平台
    const fromHighSalaryPlatform = isFromHighSalaryPlatform(item.sourceName);
    
    // 评分系统（满足条件越多，分数越高）
    let score = 0;
    if (isFrontend) score += 2; // 前端相关
    if (isTech) score += 1; // 技术相关
    if (hasRemote) score += 2; // 远程工作
    if (hasGoodSalary) score += 3; // 有明确的好薪资
    if (hasHighSalaryKeyword) score += 2; // 包含高薪关键词
    if (fromHighSalaryPlatform) score += 2; // 来自高薪平台
    if (text.includes('senior') || text.includes('lead') || text.includes('architect')) score += 1; // 高级职位
    if (text.includes('developer') || text.includes('engineer')) score += 1; // 开发者职位
    
    // 特殊情况：某些组合直接通过
    if (hasRemote && hasGoodSalary) return true;
    if (isFrontend && hasGoodSalary) return true;
    if (fromHighSalaryPlatform && hasRemote) return true;
    if (isRemotePlatform && isFrontend) return true;
    if (isRemotePlatform && isTech) return true; // 远程平台的技术职位
    if (isRemotePlatform && text.includes('developer')) return true; // 远程平台的开发者职位
    if (item.sourceName.includes('Reddit') && (hasRemote || isFrontend || isTech)) return true; // Reddit的相关职位
    if (item.sourceName.includes('V2EX')) return true; // V2EX所有职位都通过
    if (item.sourceName.includes('RemoteOK')) return true; // RemoteOK所有职位都通过
    if (item.sourceName.includes('Working Nomads')) return true; // Working Nomads所有职位都通过
    
    // 分数>=1就认为是高价值工作（最低门槛，确保200-300目标）
    return score >= 1;
}

// 判断是否是潜在商机
function isPotentialIdea(item: JobItem): boolean {
    if (item.type !== 'idea') return false;
    
    const text = combineText(item).toLowerCase();
    
    // 某些版块本身就是商机相关的
    if (isIdeaSourcePlatform(item.sourceName)) return true;
    
    // 检查是否包含痛点关键词
    return painPointKeywords.some(k => text.includes(k.toLowerCase()));
}

// 组合文本内容
function combineText(item: JobItem): string {
    return `${item.title} ${item.description || ''} ${item.meta || ''}`;
}

// 检查是否包含排除关键词
function hasExcludeKeywords(text: string): boolean {
    return excludeKeywords.some(k => text.includes(k.toLowerCase()));
}

// 判断是否是默认远程平台
function isDefaultRemotePlatform(sourceName: string): boolean {
    const remotePlatforms = [
        'RemoteOK', 'WeWorkRemotely', 'Remote.co', 'FlexJobs',
        'JustRemote', 'Remotive', 'Working Nomads', 'Pangian',
        'SkipTheDrive', 'AngelList', 'Toptal', 'Gun.io',
        'Reddit', 'V2EX', 'HackerNews', 'Dev.to', 'Indie',
        'Product Hunt', 'YCombinator', 'StartupJobs'
    ];
    return remotePlatforms.some(p => sourceName.includes(p));
}

// 高薪平台（这些平台通常职位薪资较高）
function isFromHighSalaryPlatform(sourceName: string): boolean {
    const highSalaryPlatforms = [
        'AngelList', 'Toptal', 'Turing', 'Arc.dev', 'X-Team',
        'Gun.io', 'Gigster', 'Hired', 'YCombinator',
        'CryptoJobs', 'Web3 Jobs', 'DeFi Jobs'
    ];
    
    return highSalaryPlatforms.some(platform => 
        sourceName.toLowerCase().includes(platform.toLowerCase())
    );
}

// 商机平台
function isIdeaSourcePlatform(sourceName: string): boolean {
    const ideaPlatforms = [
        'Reddit r/SomebodyMakeThis',
        'Reddit r/AppIdeas',
        'Reddit r/Startup_Ideas',
        'Reddit r/Business_Ideas',
        'Product Hunt',
        'Indie Hackers',
        'V2EX 奇思妙想'
    ];
    
    return ideaPlatforms.some(platform => 
        sourceName.toLowerCase().includes(platform.toLowerCase())
    );
}

// 提取薪资信息
export function extractSalary(text: string): number {
    // 匹配各种薪资格式
    const patterns = [
        /\$?(\d+)k/i,                    // 120k
        /\$(\d+),?(\d+)/,                // $120,000
        /€(\d+)k/i,                      // €100k
        /£(\d+)k/i,                      // £100k
        /(\d+)k\s*(?:usd|eur|gbp)/i,    // 120k USD
        /\$(\d+)\s*-\s*\$?(\d+)\s*\/\s*hour/i,  // $30-55/hour 或 $30-$55/hour
        /\$(\d+)\/hour/i,                // $100/hour
        /\$(\d+)\/hr/i,                  // $100/hr
        /\$(\d+)\/h/i,                   // $100/h
        /时薪\s*(\d+)\s*-?\s*(\d*)/,    // 时薪 30 或 时薪 30-55
        /\$(\d+)\s*-\s*\$(\d+)/,        // $100 - $150
        /(\d+)\s*-\s*(\d+)\s*(?:usd|美元|美金)/i, // 100-150 USD
        /(\d+)万/,                       // 中文万
        /\$(\d+)\s*per\s*hour/i,        // $100 per hour
        /(\d+)\s*(?:USD|EUR|GBP)\s*(?:per|\/)\s*(?:hour|hr)/i, // 100 USD per hour
    ];
    
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            let amount = parseInt(match[1]);
            
            // 处理不同单位
            if (text.includes('/hour') || text.includes('/hr') || text.includes('/h') || text.includes('per hour') || text.includes('时薪')) {
                // 时薪转年薪（按2000小时/年计算）
                amount = amount * 2000;
            } else if (text.includes('万')) {
                // 中文万转换（假设是月薪，转年薪）
                amount = amount * 10000 * 12;
            } else if (text.includes('/month') || text.includes('月')) {
                // 月薪转年薪
                amount = amount * 12;
            } else if (amount < 1000) {
                // k单位（年薪）
                amount = amount * 1000;
            }
            
            // 处理范围（取平均值）
            if (match[2]) {
                const amount2 = parseInt(match[2]);
                if (amount2 > amount) {
                    amount = (amount + amount2) / 2;
                }
            }
            
            return amount;
        }
    }
    
    return 0;
}

// 高级筛选选项
export interface AdvancedFilterOptions {
    minSalary?: number;
    maxSalary?: number;
    regions?: string[];
    sources?: string[];
    keywords?: string[];
    excludeKeywords?: string[];
    dateRange?: {
        start: Date;
        end: Date;
    };
}

// 高级筛选函数
export function advancedFilter(
    items: JobItem[], 
    options: AdvancedFilterOptions
): JobItem[] {
    return items.filter(item => {
        const text = combineText(item).toLowerCase();
        
        // 薪资筛选
        if (options.minSalary || options.maxSalary) {
            const salary = extractSalary(text);
            if (options.minSalary && salary < options.minSalary) return false;
            if (options.maxSalary && salary > options.maxSalary) return false;
        }
        
        // 地区筛选
        if (options.regions && options.regions.length > 0) {
            if (!options.regions.includes(item.region)) return false;
        }
        
        // 来源筛选
        if (options.sources && options.sources.length > 0) {
            if (!options.sources.some(s => item.sourceName.includes(s))) return false;
        }
        
        // 关键词筛选
        if (options.keywords && options.keywords.length > 0) {
            const hasKeyword = options.keywords.some(k => text.includes(k.toLowerCase()));
            if (!hasKeyword) return false;
        }
        
        // 排除关键词
        if (options.excludeKeywords && options.excludeKeywords.length > 0) {
            const hasExclude = options.excludeKeywords.some(k => text.includes(k.toLowerCase()));
            if (hasExclude) return false;
        }
        
        // 日期筛选
        if (options.dateRange) {
            const itemDate = new Date(item.timestamp);
            if (itemDate < options.dateRange.start || itemDate > options.dateRange.end) {
                return false;
            }
        }
        
        return true;
    });
}

// 按薪资排序
export function sortBySalary(items: JobItem[], desc = true): JobItem[] {
    return items.sort((a, b) => {
        const salaryA = extractSalary(combineText(a));
        const salaryB = extractSalary(combineText(b));
        return desc ? salaryB - salaryA : salaryA - salaryB;
    });
}

// 按时间排序
export function sortByDate(items: JobItem[], desc = true): JobItem[] {
    return items.sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return desc ? dateB - dateA : dateA - dateB;
    });
}

// 去重
export function deduplicateItems(items: JobItem[]): JobItem[] {
    const seen = new Set<string>();
    return items.filter(item => {
        // 使用标题和链接的组合作为唯一标识
        const key = `${item.title}::${item.link}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}
