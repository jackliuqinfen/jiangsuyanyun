
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001; 

// ==========================================
// ⚠️⚠️⚠️ 关键配置区域 (必须修改这里) ⚠️⚠️⚠️
// ==========================================
const DB_CONFIG = {
  host: process.env.DB_HOST || '127.0.0.1',
  // 请将下面的 'root' 修改为您的宝塔数据库用户名 (例如: yanyun_user)
  user: process.env.DB_USER || 'root', 
  // 请将下面的 'password' 修改为您的宝塔数据库密码
  password: process.env.DB_PASSWORD || 'password',
  // 请将下面的 'yanyun_db' 修改为您的宝塔数据库名
  database: process.env.DB_NAME || 'yanyun_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// COS 挂载目录 (确保此目录存在且宝塔对此有写入权限)
const COS_MOUNT_PATH = '/www/cosfs/yanyun-1250000000';

// 鉴权 Token
const EXPECTED_TOKEN = '8CG4Q0zhUzrvt14hsymoLNa+SJL9ioImlqabL5R+fJA=';
// ==========================================

// --- 启动自检逻辑 ---
async function startServer() {
  console.log('--- System Startup Checks ---');

  // 1. 检查 COS 目录权限
  try {
    if (!fs.existsSync(COS_MOUNT_PATH)) {
      console.warn(`[WARN] COS Path does not exist, attempting to create: ${COS_MOUNT_PATH}`);
      fs.mkdirSync(COS_MOUNT_PATH, { recursive: true });
    }
    // 测试写入权限
    const testFile = path.join(COS_MOUNT_PATH, '.write_test');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    console.log(`[OK] File System: Write permission confirmed for ${COS_MOUNT_PATH}`);
  } catch (e) {
    console.error(`[ERROR] File System: Cannot write to ${COS_MOUNT_PATH}. Images will fail to upload.`);
    console.error(`Reason: ${e.message}`);
  }

  // 2. 检查数据库连接
  try {
    const connection = await mysql.createConnection(DB_CONFIG);
    console.log(`[OK] Database: Connected successfully to ${DB_CONFIG.database}`);
    
    // 检查表是否存在，不存在则自动创建
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`system_kv\` (
        \`key_name\` varchar(255) NOT NULL,
        \`json_value\` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`key_name\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('[OK] Database: Table `system_kv` verified.');
    await connection.end();
  } catch (e) {
    console.error('---------------------------------------------------');
    console.error('[FATAL ERROR] Database Connection Failed!');
    console.error('请打开 server/index.js 修改 DB_CONFIG 中的数据库账号密码！');
    console.error(`Error Details: ${e.message}`);
    console.error('---------------------------------------------------');
    // 不退出进程，以便用户可以看到错误日志，但在修复前 API 不可用
  }

  // --- Middleware ---
  app.use(cors());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

  // Auth Middleware
  const authenticate = (req, res, next) => {
    if (req.method === 'GET' && req.path.startsWith('/api/file')) {
        return next();
    }
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.includes(EXPECTED_TOKEN)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  };

  const pool = mysql.createPool(DB_CONFIG);

  // --- API Routes ---

  // GET Data
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

  // POST Data
  app.post('/api/kv', authenticate, async (req, res) => {
    const { key, value } = req.body;
    if (!key || value === undefined) return res.status(400).json({ error: 'Missing key or value' });

    try {
      const stringValue = JSON.stringify(value);
      await pool.query(
        'INSERT INTO system_kv (key_name, json_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE json_value = VALUES(json_value)',
        [key, stringValue]
      );
      console.log(`[DB Success] Saved key: ${key}`);
      res.json({ success: true });
    } catch (err) {
      console.error(`[DB Error] POST ${key}:`, err.message);
      res.status(500).json({ error: 'Database save failed', details: err.message });
    }
  });

  // Multer Storage
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (!fs.existsSync(COS_MOUNT_PATH)){
          try {
            fs.mkdirSync(COS_MOUNT_PATH, { recursive: true });
          } catch(e) {
            console.error("Cannot create upload dir", e);
          }
      }
      cb(null, COS_MOUNT_PATH);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      let filename = req.query.key;
      if (!filename) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          filename = file.fieldname + '-' + uniqueSuffix + ext;
      } else {
          filename = path.basename(filename); 
          if (!filename.includes('.')) filename += ext;
      }
      cb(null, filename);
    }
  });

  const upload = multer({ storage: storage });

  // Upload File
  app.post('/api/file', authenticate, upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    console.log(`[File Success] Uploaded: ${req.file.filename}`);
    const publicUrl = `/files/${req.file.filename}`;
    res.json({ success: true, url: publicUrl });
  });

  app.listen(PORT, () => {
    console.log(`\n>>> Backend Server running on port ${PORT}`);
    console.log(`>>> Please verify Nginx proxy is forwarding /api/ to localhost:${PORT}\n`);
  });
}

startServer();
