// 薪资关键词配置
export const highSalaryKeywords = [
    // 年薪关键词 ($120k+)
    '120k', '130k', '140k', '150k', '160k', '170k', '180k', '190k', '200k',
    '220k', '250k', '275k', '300k', '350k', '400k', '450k', '500k',
    
    // 月薪关键词 ($10k+)
    '10k/month', '12k/month', '15k/month', '18k/month', '20k/month', '25k/month',
    '$10,000/month', '$12,000/month', '$15,000/month', '$18,000/month', '$20,000/month',
    '10000/month', '12000/month', '15000/month', '18000/month', '20000/month',
    
    // 欧洲薪资格式
    '€100k', '€120k', '€150k', '€180k', '€200k',
    '€8k/month', '€10k/month', '€12k/month', '€15k/month',
    '100k eur', '120k eur', '150k eur',
    
    // 英镑薪资格式
    '£90k', '£100k', '£120k', '£150k', '£180k', '£200k',
    '£8k/month', '£10k/month', '£12k/month',
    
    // 时薪关键词（$60+/hour = ~$10k+/month）
    '$60/hour', '$70/hour', '$75/hour', '$80/hour', '$90/hour', '$100/hour',
    '$120/hour', '$150/hour', '$175/hour', '$200/hour', '$250/hour',
    '60/hr', '70/hr', '75/hr', '80/hr', '90/hr', '100/hr', '120/hr', '150/hr',
    '$60/h', '$70/h', '$75/h', '$80/h', '$90/h', '$100/h', '$120/h', '$150/h',
    
    // 日薪关键词（$500+/day）
    '$500/day', '$600/day', '$700/day', '$800/day', '$900/day', '$1000/day',
    '$1200/day', '$1500/day', '$2000/day',
    '500/day', '600/day', '700/day', '800/day', '1000/day',
    
    // 合同价值关键词
    'six figure', 'six-figure', '6 figure', '6-figure',
    'competitive salary', 'competitive compensation',
    'excellent compensation', 'top tier', 'top-tier',
    
    // 中文薪资
    '1万/月', '1.2万/月', '1.5万/月', '1.8万/月', '2万/月', '2.5万/月', '3万/月',
    '10万/月', '12万/月', '15万/月', '18万/月', '20万/月',
    '年薪百万', '百万年薪', '年薪80万', '年薪100万', '年薪120万',
    '月薪1万', '月薪2万', '月薪3万', '月薪5万',
    
    // 级别指标（通常意味着高薪）
    'senior', 'staff', 'principal', 'architect', 'lead', 'manager',
    'director', 'vp', 'head of', 'cto', 'expert', 'specialist',
    
    // 福利关键词
    'equity', 'stock options', 'rsu', 'bonus', 'profit sharing',
    'unlimited pto', 'generous compensation'
];

// 前端技术关键词
export const frontendKeywords = [
    // 通用开发者关键词（放宽限制）
    'developer', 'engineer', 'programmer', 'software', 'coding',
    'fullstack', 'full-stack', 'full stack', 'tech', 'technical',
    
    // 基础技术
    'frontend', 'front-end', 'front end', 'ui', 'ux', 'ui/ux',
    'javascript', 'typescript', 'js', 'ts', 'ecmascript', 'es6',
    'html', 'css', 'html5', 'css3', 'web', 'web developer',
    
    // 主流框架
    'react', 'reactjs', 'react.js', 'react native', 'react-native',
    'vue', 'vuejs', 'vue.js', 'vue3', 'nuxt', 'nuxtjs',
    'angular', 'angularjs', 'angular.js', 'ng',
    'svelte', 'sveltekit', 'svelte-kit',
    'next', 'nextjs', 'next.js',
    'gatsby', 'gatsbyjs',
    'remix', 'remixjs',
    'astro', 'astrojs',
    'solid', 'solidjs',
    'qwik', 'fresh', 'deno',
    
    // 状态管理
    'redux', 'mobx', 'zustand', 'recoil', 'jotai', 'valtio',
    'vuex', 'pinia', 'xstate',
    
    // 工具链
    'webpack', 'vite', 'rollup', 'parcel', 'esbuild', 'swc', 'turbopack',
    'babel', 'eslint', 'prettier', 'jest', 'vitest', 'playwright', 'cypress',
    
    // CSS框架和工具
    'tailwind', 'tailwindcss', 'sass', 'scss', 'less', 'stylus',
    'styled-components', 'emotion', 'css-in-js', 'postcss',
    'bootstrap', 'material-ui', 'mui', 'ant design', 'antd',
    'chakra', 'mantine', 'shadcn',
    
    // 移动端开发
    'react native', 'flutter', 'ionic', 'capacitor', 'expo',
    'pwa', 'progressive web app',
    
    // 图形和动画
    'three.js', 'threejs', 'webgl', 'canvas', 'd3', 'd3.js',
    'gsap', 'framer motion', 'lottie', 'svg',
    
    // 职位名称
    'web developer', 'ui developer', 'ui engineer',
    'frontend developer', 'frontend engineer', 'front-end developer',
    'fullstack', 'full-stack', 'full stack',
    'software engineer', 'software developer',
    'web engineer', 'application developer',
    
    // 中文关键词
    '前端', '前端开发', 'Web开发', 'Web前端', 'UI开发', 
    '全栈', '全栈开发', 'H5开发', '移动端开发'
];

// 远程工作关键词
export const remoteKeywords = [
    'remote', 'remotely', 'remote work', 'work from home', 'wfh',
    'distributed', 'anywhere', 'worldwide', 'global',
    'location independent', 'digital nomad', 'home office',
    'virtual', 'telecommute', 'telework', 'flexible location',
    '远程', '远程办公', '在家办公', '居家办公', '全球远程',
    'remote-first', 'remote-friendly', 'remote-ok',
    '100% remote', 'fully remote', 'all remote'
];

// 用户痛点和商机关键词
export const painPointKeywords = [
    // 英文痛点关键词
    'looking for', 'need help', 'struggling with', 'pain point', 'problem',
    'frustrated', 'annoying', 'difficult', 'hard to', 'impossible to',
    'wish there was', 'would pay for', 'willing to pay', 'take my money',
    'shut up and take my money', 'someone should', 'why doesnt',
    'is there a', 'anyone know', 'recommend', 'suggestion', 'advice',
    'how to', 'how can i', 'how do you', 'best way to',
    
    // 商业验证关键词
    'validate', 'validation', 'mvp', 'proof of concept', 'prototype',
    'idea validation', 'market validation', 'customer validation',
    'early adopter', 'beta user', 'beta tester', 'feedback',
    'would you use', 'would anyone', 'interest check', 'gauge interest',
    
    // 需求表达关键词
    'need', 'require', 'must have', 'essential', 'critical',
    'want', 'desire', 'wish list', 'feature request',
    'missing', 'lack', 'doesnt exist', 'cant find',
    'alternative to', 'replacement for', 'better than',
    
    // 中文痛点关键词
    '痛点', '需求', '求助', '寻找', '找不到', '没有好的',
    '付费', '愿意付费', '求购', '需要', '缺少', 
    '体验差', '不好用', '难用', '烦人', '麻烦',
    '有没有', '求推荐', '谁能做', '找人开发', '外包',
    '想要', '希望有', '期待', '渴望', '急需',
    '痛苦', '困扰', '问题', '难题', '挑战',
    
    // 市场机会关键词
    'market gap', 'opportunity', 'niche', 'underserved',
    'disruption', 'innovation', 'game changer',
    '市场空白', '商机', '蓝海', '机会'
];

// 排除关键词（用于过滤掉不相关的内容）
export const excludeKeywords = [
    // 初级职位
    'junior', 'entry level', 'entry-level', 'intern', 'internship',
    'graduate', 'trainee', 'apprentice', 'beginner',
    '实习', '应届', '初级', '助理',
    
    // 非技术职位
    'sales', 'marketing', 'hr', 'recruiter', 'recruitment',
    'business development', 'account manager', 'customer service',
    '销售', '市场', '人力资源', '客服',
    
    // 低薪指标
    'up to $80k', 'up to 80k', '$40k', '$50k', '$60k', '$70k',
    '4万', '5万', '6万', '7万年薪',
    
    // 其他
    'unpaid', 'volunteer', 'no pay', 'equity only',
    '无薪', '志愿者', '纯股权'
];

// 薪资范围映射
export const salaryRanges = {
    '10-15': { min: 10000, max: 15000, label: '$10k-15k/月' },
    '15-20': { min: 15000, max: 20000, label: '$15k-20k/月' },
    '20-30': { min: 20000, max: 30000, label: '$20k-30k/月' },
    '30+': { min: 30000, max: Infinity, label: '$30k+/月' }
};

// 地区配置
export const regions = {
    'Global': { label: '🌍 全球', emoji: '🌍' },
    'US': { label: '🇺🇸 美国', emoji: '🇺🇸' },
    'EU': { label: '🇪🇺 欧洲', emoji: '🇪🇺' },
    'UK': { label: '🇬🇧 英国', emoji: '🇬🇧' },
    'CN': { label: '🇨🇳 中国', emoji: '🇨🇳' },
    'APAC': { label: '🌏 亚太', emoji: '🌏' }
};
