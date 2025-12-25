
export async function onRequest(context) {
  const { request, env } = context;

  // 1. 设置跨域头 (CORS)，允许前端访问
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Id',
  };

  // 2. 处理预检请求 (OPTIONS)
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 3. 获取 KV 绑定实例
    // 按照 EdgeOne Pages 文档，绑定变量在 env 对象上
    const db = env.YANYUN_DB;
    
    if (!db) {
        throw new Error('Server Config Error: KV Binding "YANYUN_DB" not found in environment variables.');
    }

    // 4. 安全校验 (验证 Token)
    const authHeader = request.headers.get('Authorization');
    // 用户提供的 Token
    const EXPECTED_TOKEN = '8CG4Q0zhUzrvt14hsymoLNa+SJL9ioImlqabL5R+fJA=';
    
    // 如果 Token 不匹配，拒绝访问
    if (!authHeader || !authHeader.includes(EXPECTED_TOKEN)) {
        return new Response(JSON.stringify({ error: 'Unauthorized: Invalid Token' }), { 
            status: 401, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        });
    }

    const url = new URL(request.url);

    // --- GET 请求: 获取数据 ---
    if (request.method === 'GET') {
        const key = url.searchParams.get('key');
        if (!key) {
            return new Response(JSON.stringify({ error: 'Key is required' }), { 
                status: 400, 
                headers: { 'Content-Type': 'application/json', ...corsHeaders } 
            });
        }
        
        const value = await db.get(key);
        
        // 如果 KV 中没有数据，返回 "null" 字符串，前端 JSON.parse 会将其转为 null 对象
        // 这样前端 storageService 可以识别并初始化默认数据
        const responseBody = value === null ? 'null' : value; 
        
        return new Response(responseBody, {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }

    // --- POST 请求: 保存数据 ---
    if (request.method === 'POST') {
        const body = await request.json();
        
        if (!body.key || body.value === undefined) {
            return new Response(JSON.stringify({ error: 'Missing key or value' }), { 
                status: 400, 
                headers: { 'Content-Type': 'application/json', ...corsHeaders } 
            });
        }
        
        // 将对象转为字符串存入 KV
        // EdgeOne KV 存入时需要字符串、Stream 或 ArrayBuffer
        await db.put(body.key, JSON.stringify(body.value));
        
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders });

  } catch (err) {
      // 捕获并返回详细错误信息，方便调试
      return new Response(JSON.stringify({ error: err.message, stack: err.stack }), { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      });
  }
}
