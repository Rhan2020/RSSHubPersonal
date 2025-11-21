import { fetchSource } from './lib/routes/my-opportunities/services/fetcher';
import { getAllSources } from './lib/routes/my-opportunities/config/sources';

async function testRemoteSources() {
    console.log('🔍 开始测试远程工作数据源...\n');
    
    const sources = getAllSources();
    const v2exRemote = sources.find(s => s.name === 'V2EX 远程工作');
    const remoteOK = sources.find(s => s.name === 'RemoteOK Frontend');
    
    // 测试V2EX
    if (v2exRemote) {
        console.log('测试 V2EX 远程工作...');
        try {
            const items = await fetchSource(v2exRemote);
            console.log(`✅ V2EX: 获取 ${items.length} 条数据`);
            if (items.length > 0) {
                console.log(`   示例: ${items[0].title}`);
            }
        } catch (error) {
            console.log(`❌ V2EX 失败: ${error.message}`);
        }
    }
    
    // 测试RemoteOK
    if (remoteOK) {
        console.log('\n测试 RemoteOK Frontend...');
        try {
            const items = await fetchSource(remoteOK);
            console.log(`✅ RemoteOK: 获取 ${items.length} 条数据`);
            if (items.length > 0) {
                console.log(`   示例: ${items[0].title}`);
            }
        } catch (error) {
            console.log(`❌ RemoteOK 失败: ${error.message}`);
        }
    }
    
    // 统计所有远程相关数据源
    const remoteSources = sources.filter(s => 
        s.name.toLowerCase().includes('remote') || 
        s.name.includes('远程')
    );
    
    console.log('\n📊 远程工作数据源统计:');
    console.log(`   总数: ${remoteSources.length} 个`);
    console.log(`   职位源: ${remoteSources.filter(s => s.type === 'job').length} 个`);
    console.log(`   分布: Global(${remoteSources.filter(s => s.region === 'Global').length}), CN(${remoteSources.filter(s => s.region === 'CN').length}), US(${remoteSources.filter(s => s.region === 'US').length}), EU(${remoteSources.filter(s => s.region === 'EU').length})`);
}

testRemoteSources();
