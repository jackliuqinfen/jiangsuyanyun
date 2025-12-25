
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001; 

// ==================================================================================
// 🔧🔧🔧 配置区域 (请在此处填入您的真实信息) 🔧🔧🔧
// ==================================================================================

// 1. 数据库配置 (请对照宝塔面板->数据库 填写)
const DB_CONFIG = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',        // ⚠️ 修改为您的数据库用户名
  password: process.env.DB_PASSWORD || 'password', // ⚠️ 修改为您的数据库密码
  database: process.env.DB_NAME || 'yanyun_db',    // ⚠️ 修改为您的数据库名
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// 2. 对象存储挂载目录 (图片上传位置)
// 如果您在宝塔安装了 "COSFS" 或 "OSSFS" 插件，请填写挂载路径 (例如 /www/cosfs/yanyun)
// 如果暂时没有，请使用默认的本地目录 './uploads'，图片将存放在服务器本地磁盘
const COS_MOUNT_PATH = process.env.COS_PATH || path.join(__dirname, 'uploads');

// 3. 鉴权 Token (前后端通讯密钥，保持默认即可)
const EXPECTED_TOKEN = '8CG4Q0zhUzrvt14hsymoLNa+SJL9ioImlqabL5R+fJA=';

// ==================================================================================

const pool = mysql.createPool(DB_CONFIG);

// --- 🚀 启动自检程序 (Startup Diagnostics) ---
async function startServer() {
  console.log('\n==================================================');
  console.log('   🚀 江苏盐韵管理系统 - 后端启动自检');
  console.log('==================================================\n');

  let dbConnected = false;
  let fsReady = false;

  // 1. 测试文件存储权限
  try {
    console.log(`[1/3] 检查文件存储路径: ${COS_MOUNT_PATH}`);
    if (!fs.existsSync(COS_MOUNT_PATH)) {
      console.log(`      目录不存在，正在自动创建...`);
      fs.mkdirSync(COS_MOUNT_PATH, { recursive: true });
    }
    // 写入测试
    const testFile = path.join(COS_MOUNT_PATH, '.write_test');
    fs.writeFileSync(testFile, 'ok');
    fs.unlinkSync(testFile);
    console.log(`      ✅ 写入权限正常。图片将存储在此目录。`);
    fsReady = true;
  } catch (e) {
    console.error(`      ❌ 错误: 无法写入存储目录！`);
    console.error(`      原因: ${e.message}`);
    console.error(`      解决: 请检查目录权限，或在宝塔中给予 www 用户写入权限。`);
  }

  // 2. 测试数据库连接
  console.log(`\n[2/3] 连接 MySQL 数据库: ${DB_CONFIG.host} / ${DB_CONFIG.database}`);
  try {
    const connection = await pool.getConnection();
    console.log(`      ✅ 数据库连接成功！`);
    
    // 自动建表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`system_kv\` (
        \`key_name\` varchar(255) NOT NULL,
        \`json_value\` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`key_name\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log(`      ✅ 数据表 system_kv 检查通过。`);
    connection.release();
    dbConnected = true;
  } catch (e) {
    console.error(`      ❌ 致命错误: 数据库连接失败！`);
    console.error(`      原因: ${e.message}`);
    console.error(`      👉 请修改 server/index.js 第 18-21 行，填入正确的账号密码。`);
  }

  // 3. 启动 HTTP 服务
  console.log(`\n[3/3] 启动 API 服务端口: ${PORT}`);
  
  // Middleware
  app.use(cors());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

  // 静态文件服务 (让前端能通过 URL 访问图片)
  // 如果是 COS 挂载盘，Nginx 需要单独配置；如果是本地目录，Express 可以直接服务
  app.use('/files', express.static(COS_MOUNT_PATH));

  // 鉴权中间件
  const authenticate = (req, res, next) => {
    // 允许公开访问图片和健康检查
    if (req.method === 'GET' && (req.path.startsWith('/files') || req.path === '/api/health')) {
        return next();
    }
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.includes(EXPECTED_TOKEN)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  };

  // --- API 接口定义 ---

  // 健康检查接口
  app.get('/api/health', async (req, res) => {
    let dbStatus = 'disconnected';
    let dbError = '';
    try {
        const conn = await pool.getConnection();
        await conn.ping();
        conn.release();
        dbStatus = 'connected';
    } catch(e) { dbError = e.message; }

    res.json({ 
        status: dbStatus === 'connected' ? 'ok' : 'error',
        database: dbStatus,
        db_error: dbError,
        storage_path: COS_MOUNT_PATH,
        timestamp: new Date().toISOString()
    });
  });

  // 获取数据 (读库)
  app.get('/api/kv', authenticate, async (req, res) => {
    const key = req.query.key;
    if (!key) return res.status(400).json({ error: 'Key required' });

    try {
      const [rows] = await pool.query('SELECT json_value FROM system_kv WHERE key_name = ?', [key]);
      if (rows.length > 0) {
        let val = rows[0].json_value;
        try {
            const jsonVal = JSON.parse(val);
            res.json(jsonVal); 
        } catch (e) {
            res.send(val);
        }
      } else {
        res.json(null);
      }
    } catch (err) {
      console.error(`[DB Error] GET ${key}:`, err.message);
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  });

  // 保存数据 (写库)
  app.post('/api/kv', authenticate, async (req, res) => {
    const { key, value } = req.body;
    if (!key || value === undefined) return res.status(400).json({ error: 'Missing key or value' });

    try {
      const stringValue = JSON.stringify(value);
      await pool.query(
        'INSERT INTO system_kv (key_name, json_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE json_value = VALUES(json_value)',
        [key, stringValue]
      );
      console.log(`[DB Saved] ${key} (${stringValue.length} bytes)`);
      res.json({ success: true });
    } catch (err) {
      console.error(`[DB Error] POST ${key}:`, err.message);
      res.status(500).json({ error: 'Database save failed', details: err.message });
    }
  });

  // 文件上传 (写文件)
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (!fs.existsSync(COS_MOUNT_PATH)) fs.mkdirSync(COS_MOUNT_PATH, { recursive: true });
      cb(null, COS_MOUNT_PATH);
    },
    filename: function (req, file, cb) {
      // 保持文件名后缀，添加时间戳防止重名
      const ext = path.extname(file.originalname);
      const uniqueName = `file_${Date.now()}_${Math.round(Math.random() * 1E9)}${ext}`;
      cb(null, uniqueName);
    }
  });

  const upload = multer({ storage: storage });

  app.post('/api/file', authenticate, upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    // 返回 URL。如果配置了 Nginx 反向代理 /files -> 本地目录，这个 URL 就能访问
    // 假设您的网站是 http://example.com，图片将通过 http://example.com/files/filename.jpg 访问
    const publicUrl = `/files/${req.file.filename}`;
    console.log(`[File Uploaded] ${req.file.filename} -> ${publicUrl}`);
    res.json({ success: true, url: publicUrl });
  });

  app.listen(PORT, () => {
    console.log('\n--------------------------------------------------');
    if (dbConnected && fsReady) {
        console.log('✅ 后端服务启动成功！');
        console.log('✅ 数据库已连接，文件存储已就绪。');
        console.log('✅ 现在刷新前端页面，数据将永久保存。');
    } else {
        console.log('⚠️ 服务已启动，但存在配置错误 (见上方红色报错)。');
        console.log('⚠️ 此时前端无法保存数据。请修正 server/index.js 后重启。');
    }
    console.log('--------------------------------------------------\n');
  });
}

startServer();
