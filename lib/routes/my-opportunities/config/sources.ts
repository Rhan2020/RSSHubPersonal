// 导入社交媒体数据源
import { socialMediaSources } from './social-media-sources';
// 导入可靠的数据源
import { getReliableSources } from './reliable-sources';

export interface DataSource {
    name: string;
    url: string;
    type: 'job' | 'idea';
    dataType: 'rss' | 'json' | 'html' | 'v2ex-html' | 'remoteok-json' | 'hn-json' | 'eleduck-json';
    region: 'Global' | 'CN' | 'US' | 'EU' | 'UK' | 'APAC';
    category?: string;
}

// ====== 欧美远程工作平台 ======
export const europeanAmericanJobSources: DataSource[] = [
    // --- 主流远程工作平台 ---
    // Remote.co - URL已失效，暂时注释
    // {
    //     name: 'Remote.co',
    //     url: 'https://remote.co/joblisting/tag/front-end-development/',
    //     type: 'job',
    //     dataType: 'html',
    //     region: 'Global',
    //     category: 'Premium'
    // },
    // FlexJobs - 需要付费订阅，暂时注释
    // {
    //     name: 'FlexJobs',
    //     url: 'https://www.flexjobs.com/remote-jobs/web-software-development.rss',
    //     type: 'job',
    //     dataType: 'rss',
    //     region: 'US',
    //     category: 'Premium'
    // },
    {
        name: 'JustRemote',
        url: 'https://justremote.co/remote-developer-jobs',
        type: 'job',
        dataType: 'html',  // 改为HTML解析
        region: 'Global',
        category: 'General'
    },
    {
        name: 'Remotive',
        url: 'https://remotive.io/api/remote-jobs?category=software-dev',
        type: 'job',
        dataType: 'json',
        region: 'Global',
        category: 'Popular'
    },
    {
        name: 'Working Nomads',
        url: 'https://www.workingnomads.co/api/exposed_jobs/',
        type: 'job',
        dataType: 'json',
        region: 'Global',
        category: 'Nomad'
    },
    {
        name: 'Remote.com',
        url: 'https://remote.com/api/jobs',
        type: 'job',
        dataType: 'json',
        region: 'Global',
        category: 'Enterprise'
    },
    {
        name: 'NoDesk',
        url: 'https://nodesk.co/remote-work/engineering/',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Curated'
    },
    {
        name: 'Pangian',
        url: 'https://pangian.com/api/jobs/frontend',
        type: 'job',
        dataType: 'json',
        region: 'Global',
        category: 'Community'
    },
    {
        name: 'SkipTheDrive',
        url: 'https://www.skipthedrive.com/jobs/web-development/',
        type: 'job',
        dataType: 'html',
        region: 'US',
        category: 'US-focused'
    },
    {
        name: 'Outsourcely',
        url: 'https://www.outsourcely.com/remote-frontend-jobs',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Freelance'
    },
    
    // --- 欧洲专属平台 ---
    {
        name: 'EuropeRemotely',
        url: 'https://europeremotely.com/remote-developer-jobs.rss',
        type: 'job',
        dataType: 'rss',
        region: 'EU',
        category: 'EU-only'
    },
    {
        name: 'RemoteEurope',
        url: 'https://remote-europe.com/api/jobs?category=engineering',
        type: 'job',
        dataType: 'json',
        region: 'EU',
        category: 'EU-only'
    },
    {
        name: 'JobsInNetwork EU',
        url: 'https://www.jobsinnetwork.com/remote-jobs/europe',
        type: 'job',
        dataType: 'html',
        region: 'EU',
        category: 'EU-only'
    },
    {
        name: 'Landing.jobs',
        url: 'https://landing.jobs/feed/jobs.rss',
        type: 'job',
        dataType: 'rss',
        region: 'EU',
        category: 'EU-tech'
    },
    
    // --- 英国平台 ---
    {
        name: 'WorkInStartups UK',
        url: 'https://workinstartups.com/job-board/jobs-in-london/',
        type: 'job',
        dataType: 'html',
        region: 'UK',
        category: 'UK-startup'
    },
    {
        name: 'Otta UK',
        url: 'https://otta.com/api/jobs?location=remote&role=engineering',
        type: 'job',
        dataType: 'json',
        region: 'UK',
        category: 'UK-tech'
    },
    
    // --- 高端/专业平台 ---
    {
        name: 'Hired',
        url: 'https://hired.com/api/jobs/remote',
        type: 'job',
        dataType: 'json',
        region: 'Global',
        category: 'Premium'
    },
    {
        name: 'Gun.io',
        url: 'https://gun.io/find-work/',
        type: 'job',
        dataType: 'html',
        region: 'US',
        category: 'Elite'
    },
    {
        name: 'X-Team',
        url: 'https://x-team.com/remote-programming-jobs/',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Elite'
    },
    {
        name: 'Gigster',
        url: 'https://gigster.com/api/jobs',
        type: 'job',
        dataType: 'json',
        region: 'US',
        category: 'Elite'
    },
    
    // --- 创业公司平台 ---
    {
        name: 'AngelList Talent',
        url: 'https://angel.co/api/jobs?remote=true&role=frontend',
        type: 'job',
        dataType: 'json',
        region: 'Global',
        category: 'Startup'
    },
    {
        name: 'StartupJobs',
        url: 'https://startup.jobs/api/jobs?category=engineering&remote=true',
        type: 'job',
        dataType: 'json',
        region: 'Global',
        category: 'Startup'
    },
    {
        name: 'YCombinator Jobs',
        url: 'https://www.ycombinator.com/jobs/feed.rss',
        type: 'job',
        dataType: 'rss',
        region: 'Global',
        category: 'YC-backed'
    },
    {
        name: 'Built In Remote',
        url: 'https://builtin.com/jobs/remote/dev-engineering',
        type: 'job',
        dataType: 'html',
        region: 'US',
        category: 'Tech-hub'
    },
    
    // --- Crypto/Web3 平台 ---
    {
        name: 'CryptoJobs',
        url: 'https://cryptojobs.com/api/jobs?category=engineering',
        type: 'job',
        dataType: 'json',
        region: 'Global',
        category: 'Web3'
    },
    {
        name: 'Web3 Jobs',
        url: 'https://web3.career/api/jobs?category=frontend',
        type: 'job',
        dataType: 'json',
        region: 'Global',
        category: 'Web3'
    },
    {
        name: 'Cryptocurrency Jobs',
        url: 'https://cryptocurrencyjobs.co/engineering/',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Crypto'
    },
    {
        name: 'DeFi Jobs',
        url: 'https://defijobs.co/api/jobs',
        type: 'job',
        dataType: 'json',
        region: 'Global',
        category: 'DeFi'
    },
    
    // --- 自由职业平台 ---
    {
        name: 'Upwork High-Paid',
        url: 'https://www.upwork.com/freelance-jobs/front-end-development/',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Freelance'
    },
    {
        name: 'Contra',
        url: 'https://contra.com/api/jobs?category=engineering',
        type: 'job',
        dataType: 'json',
        region: 'Global',
        category: 'Freelance'
    },
    {
        name: 'FreelancerMap',
        url: 'https://www.freelancermap.com/projects/frontend',
        type: 'job',
        dataType: 'html',
        region: 'EU',
        category: 'Freelance'
    },
    {
        name: 'Guru',
        url: 'https://www.guru.com/d/jobs/c/programming-development/',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Freelance'
    },
    
    // --- 技术社区平台 ---
    {
        name: 'Stack Overflow Jobs',
        url: 'https://stackoverflow.com/jobs/feed?r=true&tl=javascript',
        type: 'job',
        dataType: 'rss',
        region: 'Global',
        category: 'Developer'
    },
    {
        name: 'Dice Remote',
        url: 'https://www.dice.com/jobs/remote/frontend',
        type: 'job',
        dataType: 'html',
        region: 'US',
        category: 'Tech'
    },
    {
        name: 'Authentic Jobs',
        url: 'https://authenticjobs.com/rss/custom.php?remote=1',
        type: 'job',
        dataType: 'rss',
        region: 'Global',
        category: 'Design-Dev'
    },
    {
        name: 'Dribbble Jobs',
        url: 'https://dribbble.com/jobs?category=web-front-end',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Design-Dev'
    },
    {
        name: 'Behance Job Board',
        url: 'https://www.behance.net/jobboard?field=ui-ux',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Creative'
    },
    
    // --- 澳洲/亚太平台 ---
    {
        name: 'Seek Australia Remote',
        url: 'https://www.seek.com.au/remote-work-from-home-jobs',
        type: 'job',
        dataType: 'html',
        region: 'APAC',
        category: 'AU-NZ'
    },
    {
        name: 'Indeed Australia Remote',
        url: 'https://au.indeed.com/jobs?q=frontend+remote',
        type: 'job',
        dataType: 'html',
        region: 'APAC',
        category: 'AU-NZ'
    },
    
    // --- 加拿大平台 ---
    {
        name: 'RemoteLeaf Canada',
        url: 'https://remoteleaf.com/remote-jobs/canada',
        type: 'job',
        dataType: 'html',
        region: 'US',
        category: 'Canada'
    },
    {
        name: 'CareerBeacon Remote',
        url: 'https://www.careerbeacon.com/en/search/remote-jobs',
        type: 'job',
        dataType: 'html',
        region: 'US',
        category: 'Canada'
    }
];

// ====== 原有数据源 ======
export const existingSources: DataSource[] = [
    // --- 中文社区 ---
    {
        name: 'V2EX 远程工作',
        url: 'https://www.v2ex.com/go/remote',
        type: 'job',
        dataType: 'v2ex-html',
        region: 'CN'
    },
    {
        name: 'V2EX 酷工作',
        url: 'https://www.v2ex.com/go/jobs',
        type: 'job',
        dataType: 'v2ex-html',
        region: 'CN'
    },
    {
        name: '电鸭社区',
        url: 'https://eleduck.com/api/v1/posts?category=5',
        type: 'job',
        dataType: 'eleduck-json',
        region: 'CN'
    },
    
    // --- 已有的全球平台 ---
    {
        name: 'RemoteOK Frontend',
        url: 'https://remoteok.com/api?tag=frontend,react,vue,javascript',
        type: 'job',
        dataType: 'remoteok-json',
        region: 'Global'
    },
    {
        name: 'We Work Remotely',
        url: 'https://weworkremotely.com/categories/remote-front-end-programming-jobs.rss',
        type: 'job',
        dataType: 'rss',
        region: 'Global'
    },
    
    // --- Hacker News ---
    {
        name: 'HN Who is Hiring',
        url: 'http://hn.algolia.com/api/v1/search_by_date?query="who is hiring"&tags=story',
        type: 'job',
        dataType: 'hn-json',
        region: 'Global'
    },
    {
        name: 'HN Freelancer',
        url: 'http://hn.algolia.com/api/v1/search_by_date?query=freelancer&tags=story',
        type: 'job',
        dataType: 'hn-json',
        region: 'Global'
    },
    
    // --- Reddit ---
    {
        name: 'Reddit r/remotejs',
        url: 'https://www.reddit.com/r/remotejs/new/.rss',
        type: 'job',
        dataType: 'rss',
        region: 'Global'
    },
    {
        name: 'Reddit r/forhire',
        url: 'https://www.reddit.com/r/forhire/search.rss?q=frontend+OR+react+OR+vue&restrict_sr=1&sort=new',
        type: 'job',
        dataType: 'rss',
        region: 'Global'
    },
    {
        name: 'Reddit r/RemoteJobs',
        url: 'https://www.reddit.com/r/RemoteJobs/new/.rss',
        type: 'job',
        dataType: 'rss',
        region: 'Global'
    },
    {
        name: 'Reddit r/WorkOnline',
        url: 'https://www.reddit.com/r/WorkOnline/new/.rss',
        type: 'job',
        dataType: 'rss',
        region: 'Global'
    },
    
    // --- Dev.to ---
    {
        name: 'Dev.to Remote',
        url: 'https://dev.to/feed/tag/remote',
        type: 'job',
        dataType: 'rss',
        region: 'Global'
    },
    {
        name: 'Dev.to Jobs',
        url: 'https://dev.to/feed/tag/hiring',
        type: 'job',
        dataType: 'rss',
        region: 'Global'
    }
];

// ====== 商机数据源 ======
export const ideaSources: DataSource[] = [
    // --- 中文社区 ---
    {
        name: 'V2EX 奇思妙想',
        url: 'https://www.v2ex.com/go/ideas',
        type: 'idea',
        dataType: 'v2ex-html',
        region: 'CN'
    },
    {
        name: 'V2EX 问与答',
        url: 'https://www.v2ex.com/go/qna',
        type: 'idea',
        dataType: 'v2ex-html',
        region: 'CN'
    },
    {
        name: 'V2EX 分享创造',
        url: 'https://www.v2ex.com/go/create',
        type: 'idea',
        dataType: 'v2ex-html',
        region: 'CN'
    },
    
    // --- 全球商机平台 ---
    {
        name: 'Product Hunt Daily',
        url: 'https://www.producthunt.com/feed',
        type: 'idea',
        dataType: 'rss',
        region: 'Global'
    },
    {
        name: 'Indie Hackers',
        url: 'https://www.indiehackers.com/feed.xml',
        type: 'idea',
        dataType: 'rss',
        region: 'Global'
    },
    {
        name: 'Reddit r/SomebodyMakeThis',
        url: 'https://www.reddit.com/r/SomebodyMakeThis/new/.rss',
        type: 'idea',
        dataType: 'rss',
        region: 'Global'
    },
    {
        name: 'Reddit r/AppIdeas',
        url: 'https://www.reddit.com/r/AppIdeas/new/.rss',
        type: 'idea',
        dataType: 'rss',
        region: 'Global'
    },
    {
        name: 'Reddit r/Startup_Ideas',
        url: 'https://www.reddit.com/r/Startup_Ideas/new/.rss',
        type: 'idea',
        dataType: 'rss',
        region: 'Global'
    },
    {
        name: 'Reddit r/SideProject',
        url: 'https://www.reddit.com/r/SideProject/hot/.rss',
        type: 'idea',
        dataType: 'rss',
        region: 'Global'
    },
    {
        name: 'Reddit r/EntrepreneurRideAlong',
        url: 'https://www.reddit.com/r/EntrepreneurRideAlong/new/.rss',
        type: 'idea',
        dataType: 'rss',
        region: 'Global'
    },
    {
        name: 'Reddit r/Business_Ideas',
        url: 'https://www.reddit.com/r/Business_Ideas/new/.rss',
        type: 'idea',
        dataType: 'rss',
        region: 'Global'
    },
    {
        name: 'Reddit r/Lightbulb',
        url: 'https://www.reddit.com/r/Lightbulb/new/.rss',
        type: 'idea',
        dataType: 'rss',
        region: 'Global'
    },
    {
        name: 'HN Show',
        url: 'http://hn.algolia.com/api/v1/search_by_date?query="Show HN"&tags=story',
        type: 'idea',
        dataType: 'hn-json',
        region: 'Global'
    },
    {
        name: 'HN Ask',
        url: 'http://hn.algolia.com/api/v1/search_by_date?query="Ask HN"&tags=story',
        type: 'idea',
        dataType: 'hn-json',
        region: 'Global'
    },
    {
        name: 'HN Launch',
        url: 'http://hn.algolia.com/api/v1/search_by_date?query="Launch HN"&tags=story',
        type: 'idea',
        dataType: 'hn-json',
        region: 'Global'
    }
];

// 合并所有数据源
export const getAllSources = (): DataSource[] => {
    // 优先使用可靠的数据源
    const reliableSources = getReliableSources();
    
    // 合并其他数据源，但排除重复的
    const otherSources = [
        ...europeanAmericanJobSources,
        ...existingSources,
        ...ideaSources,
        ...socialMediaSources
    ];
    
    // 创建一个Set来跟踪已添加的源名称
    const addedNames = new Set(reliableSources.map(s => s.name));
    
    // 过滤掉重复的源
    const uniqueOtherSources = otherSources.filter(s => {
        if (addedNames.has(s.name)) {
            return false;
        }
        addedNames.add(s.name);
        return true;
    });
    
    // 可靠的源在前，其他源在后
    return [
        ...reliableSources,
        ...uniqueOtherSources
    ];
};

// 按地区获取数据源
export const getSourcesByRegion = (region: string): DataSource[] => {
    return getAllSources().filter(s => s.region === region || region === 'All');
};

// 按类型获取数据源
export const getSourcesByType = (type: 'job' | 'idea'): DataSource[] => {
    return getAllSources().filter(s => s.type === type);
};
