// 可靠的数据源配置 - 经过测试验证
import type { DataSource } from './sources';

export const reliableSources: DataSource[] = [
    // ====== 中文社区（验证可用） ======
    {
        name: 'V2EX 远程工作',
        url: 'https://www.v2ex.com/go/remote',
        type: 'job',
        dataType: 'v2ex-html',
        region: 'CN',
    },
    {
        name: 'V2EX 酷工作',
        url: 'https://www.v2ex.com/go/jobs',
        type: 'job',
        dataType: 'v2ex-html',
        region: 'CN',
    },
    {
        name: 'V2EX 奇思妙想',
        url: 'https://www.v2ex.com/go/ideas',
        type: 'idea',
        dataType: 'v2ex-html',
        region: 'CN',
    },

    // ====== RemoteOK（验证可用） ======
    {
        name: 'RemoteOK Frontend',
        url: 'https://remoteok.com/api?tag=frontend,react,vue,javascript',
        type: 'job',
        dataType: 'remoteok-json',
        region: 'Global',
    },
    {
        name: 'RemoteOK React',
        url: 'https://remoteok.com/api?tag=react,reactjs',
        type: 'job',
        dataType: 'remoteok-json',
        region: 'Global',
    },
    {
        name: 'RemoteOK Vue',
        url: 'https://remoteok.com/api?tag=vue,vuejs',
        type: 'job',
        dataType: 'remoteok-json',
        region: 'Global',
    },
    {
        name: 'RemoteOK JavaScript',
        url: 'https://remoteok.com/api?tag=javascript,typescript,nodejs',
        type: 'job',
        dataType: 'remoteok-json',
        region: 'Global',
    },

    // ====== Working Nomads（验证可用） ======
    {
        name: 'Working Nomads',
        url: 'https://www.workingnomads.co/api/exposed_jobs/',
        type: 'job',
        dataType: 'json',
        region: 'Global',
    },

    // ====== Reddit 子版块（验证可用） ======
    {
        name: 'Reddit r/remotejs',
        url: 'https://www.reddit.com/r/remotejs/new.json',
        type: 'job',
        dataType: 'json',
        region: 'Global',
    },
    {
        name: 'Reddit r/forhire',
        url: 'https://www.reddit.com/r/forhire/new.json',
        type: 'job',
        dataType: 'json',
        region: 'Global',
    },
    {
        name: 'Reddit r/RemoteJobs',
        url: 'https://www.reddit.com/r/RemoteJobs/new.json',
        type: 'job',
        dataType: 'json',
        region: 'Global',
    },
    {
        name: 'Reddit r/WorkOnline',
        url: 'https://www.reddit.com/r/WorkOnline/new.json',
        type: 'job',
        dataType: 'json',
        region: 'Global',
    },
    {
        name: 'Reddit r/remotework',
        url: 'https://www.reddit.com/r/remotework/new.json',
        type: 'job',
        dataType: 'json',
        region: 'Global',
    },
    {
        name: 'Reddit r/digitalnomad',
        url: 'https://www.reddit.com/r/digitalnomad/new.json',
        type: 'job',
        dataType: 'json',
        region: 'Global',
    },

    // ====== 商机和创意（验证可用） ======
    {
        name: 'Reddit r/SomebodyMakeThis',
        url: 'https://www.reddit.com/r/SomebodyMakeThis/new.json',
        type: 'idea',
        dataType: 'json',
        region: 'Global',
    },
    {
        name: 'Reddit r/AppIdeas',
        url: 'https://www.reddit.com/r/AppIdeas/new.json',
        type: 'idea',
        dataType: 'json',
        region: 'Global',
    },
    {
        name: 'Reddit r/Startup_Ideas',
        url: 'https://www.reddit.com/r/Startup_Ideas/new.json',
        type: 'idea',
        dataType: 'json',
        region: 'Global',
    },
    {
        name: 'Reddit r/Business_Ideas',
        url: 'https://www.reddit.com/r/Business_Ideas/new.json',
        type: 'idea',
        dataType: 'json',
        region: 'Global',
    },
    {
        name: 'Reddit r/SideProject',
        url: 'https://www.reddit.com/r/SideProject/new.json',
        type: 'idea',
        dataType: 'json',
        region: 'Global',
    },
    {
        name: 'Reddit r/EntrepreneurRideAlong',
        url: 'https://www.reddit.com/r/EntrepreneurRideAlong/new.json',
        type: 'idea',
        dataType: 'json',
        region: 'Global',
    },

    // ====== HackerNews（需要特殊处理） ======
    {
        name: 'HackerNews Hiring',
        url: 'https://hacker-news.firebaseio.com/v0/jobstories.json',
        type: 'job',
        dataType: 'hn-json',
        region: 'Global',
    },

    // ====== 额外的可靠源 ======
    {
        name: 'We Work Remotely',
        url: 'https://weworkremotely.com/categories/remote-front-end-programming-jobs.rss',
        type: 'job',
        dataType: 'rss',
        region: 'Global',
    },
    {
        name: 'NoDesk',
        url: 'https://nodesk.co/remote-work/resources/',
        type: 'job',
        dataType: 'html',
        region: 'Global',
    },
    // {
    //     name: 'Remote Python',
    //     url: 'https://www.python.org/jobs/feed/rss/',
    //     type: 'job',
    //     dataType: 'rss',
    //     region: 'Global'
    // },

    // ====== Dev.to 开发者社区 ======
    {
        name: 'Dev.to Jobs',
        url: 'https://dev.to/feed/jobs',
        type: 'job',
        dataType: 'rss',
        region: 'Global',
    },
    {
        name: 'Dev.to Remote',
        url: 'https://dev.to/t/remote/feed',
        type: 'job',
        dataType: 'rss',
        region: 'Global',
    },

    // ====== IndieHackers ======
    {
        name: 'Indie Hackers',
        url: 'https://www.indiehackers.com/feed.json',
        type: 'idea',
        dataType: 'json',
        region: 'Global',
    },

    // ====== Product Hunt ======
    {
        name: 'Product Hunt Jobs',
        url: 'https://www.producthunt.com/jobs',
        type: 'job',
        dataType: 'html',
        region: 'Global',
    },
];

// 导出函数获取所有可靠的数据源
export function getReliableSources(): DataSource[] {
    return reliableSources;
}

// 获取高优先级的数据源（最稳定的）
export function getHighPrioritySources(): DataSource[] {
    return reliableSources.filter((s) => s.name.includes('V2EX') || s.name.includes('RemoteOK') || s.name.includes('Working Nomads') || s.name.includes('Reddit'));
}
