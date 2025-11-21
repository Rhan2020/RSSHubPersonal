import type { DataSource } from './sources';

// ====== 社交媒体数据源 ======
export const socialMediaSources: DataSource[] = [
    // --- LinkedIn ---
    {
        name: 'LinkedIn Jobs Remote',
        url: 'https://www.linkedin.com/jobs/search/?keywords=frontend%20developer&location=Remote&f_WT=2',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'LinkedIn'
    },
    {
        name: 'LinkedIn Frontend Remote',
        url: 'https://www.linkedin.com/jobs/remote-frontend-developer-jobs',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'LinkedIn'
    },
    {
        name: 'LinkedIn React Remote',
        url: 'https://www.linkedin.com/jobs/remote-react-developer-jobs',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'LinkedIn'
    },
    {
        name: 'LinkedIn Senior Frontend',
        url: 'https://www.linkedin.com/jobs/senior-frontend-developer-remote-jobs',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'LinkedIn'
    },
    {
        name: 'LinkedIn Startup Jobs',
        url: 'https://www.linkedin.com/jobs/startup-jobs-remote',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'LinkedIn'
    },
    
    // --- Twitter/X ---
    {
        name: 'Twitter Remote Work',
        url: 'https://twitter.com/search?q=%23remotework%20%23frontend%20%24100k&src=typed_query&f=live',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Twitter'
    },
    {
        name: 'Twitter Hiring Threads',
        url: 'https://twitter.com/search?q=%23hiring%20%23frontend%20remote&src=typed_query&f=live',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Twitter'
    },
    {
        name: 'Twitter Tech Jobs',
        url: 'https://twitter.com/search?q=%23techjobs%20%23javascript%20remote&src=typed_query&f=live',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Twitter'
    },
    {
        name: 'Twitter Web3 Jobs',
        url: 'https://twitter.com/search?q=%23web3jobs%20%23defi%20%23frontend&src=typed_query&f=live',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Twitter'
    },
    {
        name: 'Twitter Startup Ideas',
        url: 'https://twitter.com/search?q=%22startup%20idea%22%20OR%20%22app%20idea%22%20OR%20%22pain%20point%22&f=live',
        type: 'idea',
        dataType: 'html',
        region: 'Global',
        category: 'Twitter'
    },
    
    // --- Facebook Groups ---
    {
        name: 'FB Remote Work Community',
        url: 'https://www.facebook.com/groups/remoteworkcommunity/jobs',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Facebook'
    },
    {
        name: 'FB Frontend Developers',
        url: 'https://www.facebook.com/groups/frontenddevelopers/jobs',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Facebook'
    },
    {
        name: 'FB React Developers',
        url: 'https://www.facebook.com/groups/react.developers/jobs',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Facebook'
    },
    {
        name: 'FB JavaScript Jobs',
        url: 'https://www.facebook.com/groups/javascript.jobs/jobs',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Facebook'
    },
    {
        name: 'FB Startup Jobs Network',
        url: 'https://www.facebook.com/groups/startupjobsnetwork',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Facebook'
    },
    
    // --- Instagram (通过标签搜索) ---
    {
        name: 'Instagram #RemoteWork',
        url: 'https://www.instagram.com/explore/tags/remotework/',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Instagram'
    },
    {
        name: 'Instagram #TechJobs',
        url: 'https://www.instagram.com/explore/tags/techjobs/',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Instagram'
    },
    {
        name: 'Instagram #StartupLife',
        url: 'https://www.instagram.com/explore/tags/startuplife/',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Instagram'
    },
    {
        name: 'Instagram #Hiring',
        url: 'https://www.instagram.com/explore/tags/hiringnow/',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Instagram'
    },
    
    // --- Discord (开发者社区) ---
    {
        name: 'Discord Reactiflux Jobs',
        url: 'https://discord.gg/reactiflux', // #jobs channel
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Discord'
    },
    {
        name: 'Discord Vue Land Jobs',
        url: 'https://discord.gg/vue', // #job-board channel
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Discord'
    },
    {
        name: 'Discord Remote Work Hub',
        url: 'https://discord.gg/remotework',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Discord'
    },
    {
        name: 'Discord Web3 Jobs',
        url: 'https://discord.gg/web3jobs',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Discord'
    },
    
    // --- Slack Communities (通过公开链接) ---
    {
        name: 'Slack TechLadies',
        url: 'https://techladies.slack.com/jobs',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Slack'
    },
    {
        name: 'Slack Frontend Developers',
        url: 'https://frontenddevelopers.slack.com',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Slack'
    },
    {
        name: 'Slack Remote Workers',
        url: 'https://remoteworkers.slack.com',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Slack'
    },
    
    // --- Telegram Channels ---
    {
        name: 'Telegram Remote Jobs',
        url: 'https://t.me/remotejobsch',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Telegram'
    },
    {
        name: 'Telegram Frontend Jobs',
        url: 'https://t.me/frontendjobs',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Telegram'
    },
    {
        name: 'Telegram Web3 Jobs',
        url: 'https://t.me/web3jobsofficial',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Telegram'
    },
    {
        name: 'Telegram Startup Jobs',
        url: 'https://t.me/startupjobs',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Telegram'
    },
    
    // --- YouTube (Tech Channels) ---
    {
        name: 'YouTube Tech Jobs',
        url: 'https://www.youtube.com/results?search_query=remote+frontend+jobs+2024&sp=CAI%253D',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'YouTube'
    },
    {
        name: 'YouTube Startup Ideas',
        url: 'https://www.youtube.com/results?search_query=startup+ideas+2024+saas&sp=CAI%253D',
        type: 'idea',
        dataType: 'html',
        region: 'Global',
        category: 'YouTube'
    },
    
    // --- Mastodon (去中心化社交) ---
    {
        name: 'Mastodon Tech Jobs',
        url: 'https://mastodon.social/tags/remotework',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Mastodon'
    },
    {
        name: 'Mastodon Frontend',
        url: 'https://mastodon.social/tags/frontend',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Mastodon'
    },
    
    // --- Threads (Meta) ---
    {
        name: 'Threads Tech Jobs',
        url: 'https://www.threads.net/search?q=%23remotework%20%23techjobs',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Threads'
    },
    {
        name: 'Threads Hiring',
        url: 'https://www.threads.net/search?q=%23hiring%20%23frontend',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Threads'
    },
    
    // --- TikTok (短视频平台) ---
    {
        name: 'TikTok Tech Jobs',
        url: 'https://www.tiktok.com/tag/techjobs',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'TikTok'
    },
    {
        name: 'TikTok Remote Work',
        url: 'https://www.tiktok.com/tag/remotework',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'TikTok'
    },
    {
        name: 'TikTok Startup Ideas',
        url: 'https://www.tiktok.com/tag/startupideas',
        type: 'idea',
        dataType: 'html',
        region: 'Global',
        category: 'TikTok'
    },
    
    // --- Pinterest (创意平台) ---
    {
        name: 'Pinterest Remote Jobs',
        url: 'https://www.pinterest.com/search/pins/?q=remote%20jobs%20frontend',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Pinterest'
    },
    {
        name: 'Pinterest Startup Ideas',
        url: 'https://www.pinterest.com/search/pins/?q=startup%20ideas%20app',
        type: 'idea',
        dataType: 'html',
        region: 'Global',
        category: 'Pinterest'
    },
    
    // --- Clubhouse (音频社交) ---
    {
        name: 'Clubhouse Tech Talks',
        url: 'https://www.clubhouse.com/topics/tech-jobs',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Clubhouse'
    },
    
    // --- WhatsApp Groups (通过邀请链接) ---
    {
        name: 'WhatsApp Remote Work',
        url: 'https://chat.whatsapp.com/remotework',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'WhatsApp'
    },
    
    // --- Snapchat Discover ---
    {
        name: 'Snapchat Tech News',
        url: 'https://www.snapchat.com/discover/tech-jobs',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Snapchat'
    },
    
    // --- Medium Publications ---
    {
        name: 'Medium Remote Work',
        url: 'https://medium.com/tag/remote-work/latest',
        type: 'job',
        dataType: 'rss',
        region: 'Global',
        category: 'Medium'
    },
    {
        name: 'Medium Frontend Jobs',
        url: 'https://medium.com/tag/frontend-development/latest',
        type: 'job',
        dataType: 'rss',
        region: 'Global',
        category: 'Medium'
    },
    {
        name: 'Medium Startup Ideas',
        url: 'https://medium.com/tag/startup-ideas/latest',
        type: 'idea',
        dataType: 'rss',
        region: 'Global',
        category: 'Medium'
    },
    
    // --- Quora Spaces ---
    {
        name: 'Quora Remote Work',
        url: 'https://www.quora.com/q/remotework',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Quora'
    },
    {
        name: 'Quora Frontend Dev',
        url: 'https://www.quora.com/q/frontenddevelopment',
        type: 'job',
        dataType: 'html',
        region: 'Global',
        category: 'Quora'
    },
    {
        name: 'Quora Startup Ideas',
        url: 'https://www.quora.com/q/startupideas',
        type: 'idea',
        dataType: 'html',
        region: 'Global',
        category: 'Quora'
    }
];

// 社交媒体专用关键词
export const socialMediaKeywords = {
    // LinkedIn 特定关键词
    linkedin: [
        'we are hiring', 'join our team', 'open position',
        'looking for', 'opportunity', 'apply now',
        '#hiring', '#remotework', '#techjobs',
        'competitive salary', 'great benefits'
    ],
    
    // Twitter/X 标签
    twitter: [
        '#hiring', '#remotework', '#techjobs', '#frontend',
        '#javascript', '#react', '#vue', '#typescript',
        '#100kclub', '#sixfigures', '#startup', '#web3jobs'
    ],
    
    // Instagram 标签
    instagram: [
        '#remotework', '#digitalnomad', '#workfromanywhere',
        '#techjobs', '#hiring', '#frontenddeveloper',
        '#startuplife', '#entrepreneurship'
    ],
    
    // Facebook Groups 关键词
    facebook: [
        'hiring', 'looking for', 'remote position',
        'frontend developer needed', 'react developer',
        'competitive pay', 'immediate start'
    ],
    
    // Discord/Slack 频道名
    channels: [
        'jobs', 'job-board', 'hiring', 'opportunities',
        'gigs', 'freelance', 'remote-work', 'career'
    ]
};

// 社交媒体平台配置
export const socialMediaPlatforms = {
    linkedin: {
        name: 'LinkedIn',
        icon: '💼',
        color: '#0077B5',
        priority: 1
    },
    twitter: {
        name: 'Twitter/X',
        icon: '🐦',
        color: '#1DA1F2',
        priority: 2
    },
    facebook: {
        name: 'Facebook',
        icon: '📘',
        color: '#1877F2',
        priority: 3
    },
    instagram: {
        name: 'Instagram',
        icon: '📸',
        color: '#E4405F',
        priority: 4
    },
    discord: {
        name: 'Discord',
        icon: '💬',
        color: '#5865F2',
        priority: 5
    },
    telegram: {
        name: 'Telegram',
        icon: '✈️',
        color: '#2AABEE',
        priority: 6
    },
    slack: {
        name: 'Slack',
        icon: '💡',
        color: '#4A154B',
        priority: 7
    },
    threads: {
        name: 'Threads',
        icon: '🧵',
        color: '#000000',
        priority: 8
    },
    mastodon: {
        name: 'Mastodon',
        icon: '🐘',
        color: '#6364FF',
        priority: 9
    },
    medium: {
        name: 'Medium',
        icon: '📝',
        color: '#000000',
        priority: 10
    }
};
