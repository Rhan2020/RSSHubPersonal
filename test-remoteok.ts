import { fetchRemoteOKEnhanced } from './lib/routes/my-opportunities/services/enhanced-fetcher';

async function testRemoteOK() {
    console.log('Testing RemoteOK API...');
    
    const source = {
        name: 'RemoteOK Frontend',
        url: 'https://remoteok.com/api?tag=frontend,react,vue,javascript',
        type: 'job' as const,
        dataType: 'remoteok-json' as const,
        region: 'Global' as const
    };
    
    try {
        const items = await fetchRemoteOKEnhanced(source);
        console.log(`✅ Success! Got ${items.length} items`);
        
        if (items.length > 0) {
            console.log('\nFirst 3 jobs:');
            items.slice(0, 3).forEach((job, i) => {
                console.log(`\n${i + 1}. ${job.title}`);
                console.log(`   Company: ${job.author}`);
                console.log(`   Salary: ${job.salary || 'Not specified'}`);
                console.log(`   Link: ${job.link}`);
            });
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testRemoteOK();
