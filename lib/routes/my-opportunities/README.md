# 🌍 全球高薪前端机会雷达 (Global Opportunity Radar)

## 📝 项目简介

这是一个专为资深前端开发者打造的全球机会聚合系统，专注于：

1. **高薪远程工作机会** - 月薪 $10k+ 或年薪 $120k+ 的前端职位
2. **用户需求痛点与商机** - 发现有付费意愿的用户需求，便于开发 App/Website 解决问题并盈利

## 🚀 功能特点

### 核心功能
- **50+ 全球数据源** - 覆盖中文和英文主流平台
- **智能筛选** - 自动筛选月薪 $10k+ 的远程前端职位
- **实时更新** - 10分钟缓存机制，保证数据新鲜度
- **交互式界面** - 支持搜索、筛选、导出等功能

### 数据源覆盖（150+ 平台）

#### 工作机会平台
- **中文社区**: V2EX (远程/酷工作)、电鸭社区
- **全球平台**: RemoteOK、We Work Remotely、RemoteLeads、Remotive、JustRemote
- **开发者社区**: Hacker News、Dev.to、GitHub Jobs、Stack Overflow
- **Reddit板块**: r/remotejs、r/forhire、r/RemoteJobs、r/WorkOnline
- **高端平台**: AngelList、Toptal、Turing、Arc.dev、X-Team、Gun.io
- **综合平台**: Indeed、LinkedIn、FlexJobs、Dice

#### 社交媒体监控（新增）
- **LinkedIn**: 远程职位、前端岗位、React/Vue专场、创业公司职位
- **Twitter/X**: #remotework、#hiring、#techjobs、#web3jobs 实时监控
- **Facebook Groups**: 远程工作社区、前端开发者、React/JavaScript群组
- **Instagram**: #remotework、#digitalnomad、#techjobs 标签追踪
- **Discord**: Reactiflux、Vue Land、Remote Work Hub 等开发者社区
- **Telegram**: 远程工作频道、前端职位、Web3职位订阅
- **其他平台**: Medium、Quora、TikTok、Threads、Mastodon、Pinterest

#### 商机发现平台
- **创意社区**: Product Hunt、Indie Hackers
- **需求板块**: Reddit (r/SomebodyMakeThis、r/AppIdeas、r/Startup_Ideas)
- **问答社区**: V2EX 奇思妙想、问与答、分享创造
- **技术社区**: Hacker News (Show HN、Ask HN、Launch HN)

## 📦 使用方法

### 快速开始

访问导航页查看所有可用路由：
```
http://localhost:1200/my-opportunities
```

### 🚀 完整路由列表

| 路由 | 功能 | 说明 | 推荐度 |
|------|------|------|--------|
| `/my-opportunities` | 导航页 | 查看所有可用功能和路由 | ⭐⭐⭐⭐⭐ |
| `/my-opportunities/dashboard` | 快速仪表盘 | 使用缓存，加载最快 | ⭐⭐⭐⭐⭐ |
| `/my-opportunities/global-modular` | 完整版 | 150+ 数据源，信息最全 | ⭐⭐⭐⭐⭐ |
| `/my-opportunities/realtime` | 实时监控 | 实时数据流，5分钟自动刷新 | ⭐⭐⭐⭐ |
| `/my-opportunities/filter` | 高级筛选 | 自定义条件筛选 | ⭐⭐⭐⭐ |
| `/my-opportunities/stats` | 统计面板 | 数据分析和可视化 | ⭐⭐⭐⭐ |
| `/my-opportunities/api` | API接口 | JSON数据，支持参数 | ⭐⭐⭐⭐ |
| `/my-opportunities/rss` | RSS订阅 | 标准RSS输出 | ⭐⭐⭐ |
| `/my-opportunities/test` | 测试页面 | 系统状态检查 | ⭐⭐ |
| `/my-opportunities/global` | 旧版增强 | 早期版本（备用） | ⭐⭐ |

### API 使用示例

```bash
# 获取最新20个高薪职位
curl http://localhost:1200/my-opportunities/api?type=jobs&limit=20

# 获取中国地区的商机
curl http://localhost:1200/my-opportunities/api?type=ideas&region=CN

# 获取欧洲地区的所有机会
curl http://localhost:1200/my-opportunities/api?region=EU&limit=50

# RSS订阅高薪职位
curl http://localhost:1200/my-opportunities/rss?type=jobs&limit=30
```

### 部署到服务器

1. 克隆项目并安装依赖：
   ```bash
   git clone [your-repo]
   cd RSSHubPersonal
   npm install
   ```

2. 启动 RSSHub 服务：
   ```bash
   npm start
   ```

3. 访问界面：
   ```
   http://[your-server]:1200/my-opportunities/global
   ```

## 🎯 筛选逻辑

### 高薪职位筛选标准
- **薪资要求**: 月薪 $10k+ 或年薪 $120k+
- **技术栈**: React、Vue、Angular、TypeScript、JavaScript 等前端技术
- **工作模式**: Remote、Distributed、Worldwide
- **职位级别**: Senior、Staff、Principal、Lead、Architect

### 商机识别关键词
- **英文**: looking for、need help、pain point、would pay for、validate
- **中文**: 痛点、需求、付费意愿、求购、找人开发

## 🛠️ 界面功能

### 搜索与筛选
- **关键词搜索** - 支持职位、公司、技术栈搜索
- **地区筛选** - 全球、中国、美国、欧洲
- **来源筛选** - 按数据源平台筛选
- **薪资筛选** - $10-15k、$15-20k、$20k+
- **快速筛选** - React、Vue、TypeScript、Senior 一键筛选

### 数据展示
- **实时统计** - 显示职位数、商机数、数据源数
- **卡片布局** - 清晰展示标题、来源、薪资、标签
- **时间显示** - 智能显示发布时间（刚刚、N小时前、N天前）
- **链接跳转** - 点击直达原始页面

### 数据导出
- **JSON格式** - 导出当前筛选结果
- **包含信息** - 标题、链接、来源、地区、时间

## 💡 使用建议

1. **每日查看** - 建议每天早上查看一次，了解最新机会
2. **设置提醒** - 可以将页面加入书签，定期查看
3. **关注趋势** - 注意热门技术栈和薪资趋势变化
4. **快速响应** - 发现合适机会要及时申请或联系
5. **验证商机** - 对于用户痛点，建议深入调研后再开发

## 🔧 自定义配置

### 添加新数据源

编辑 `enhanced.ts` 文件，在 `sources` 数组中添加：

```javascript
{
    name: '平台名称',
    url: 'API或RSS地址',
    type: 'job' | 'idea',
    dataType: 'rss' | 'json' | 'html',
    region: 'Global' | 'CN' | 'US' | 'EU'
}
```

### 调整筛选条件

修改 `enhanced.ts` 中的关键词数组：
- `highSalaryKeywords` - 薪资关键词
- `frontendKeywords` - 技术栈关键词
- `painPointKeywords` - 商机关键词

### 修改缓存时间

在 `fetchSource` 函数中调整缓存时间（默认600秒）：
```javascript
await cache.set(cacheKey, items, 600); // 改为你想要的秒数
```

## 📊 数据更新频率

- **缓存机制**: 10分钟更新一次
- **自动刷新**: 页面每5分钟自动刷新
- **手动刷新**: 点击界面右上角刷新按钮

## ⚠️ 注意事项

1. **API限制** - 部分平台有访问频率限制，请勿频繁刷新
2. **网络要求** - 访问国外数据源需要良好的网络环境
3. **数据准确性** - 自动筛选可能有误差，请以实际职位描述为准
4. **隐私保护** - 不要在公共环境展示个人求职信息

## 🤝 贡献指南

欢迎贡献新的数据源或改进筛选算法！

1. Fork 项目
2. 创建功能分支
3. 提交代码
4. 发起 Pull Request

## 📄 许可证

MIT License

## 🙏 致谢

感谢 RSSHub 项目提供的基础框架，以及所有数据源平台的开放接口。

---

**祝你找到理想的高薪远程工作，发现有价值的商业机会！** 🚀
