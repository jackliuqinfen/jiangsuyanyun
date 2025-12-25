
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001; // 后端运行端口

// --- 配置区域 (请在宝塔环境变量或此处修改) ---
const DB_CONFIG = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || '您的数据库用户名', 
  password: process.env.DB_PASSWORD || '您的数据库密码',
  database: process.env.DB_NAME || '您的数据库名',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// COS 挂载目录
const COS_MOUNT_PATH = '/www/cosfs/yanyun-1250000000';
// 鉴权 Token (必须与前端 storageService.ts 中的 KV_ACCESS_TOKEN 一致)
const EXPECTED_TOKEN = '8CG4Q0zhUzrvt14hsymoLNa+SJL9ioImlqabL5R+fJA=';

// --- 中间件 ---
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // 允许大JSON数据
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// 鉴权中间件
const authenticate = (req, res, next) => {
  // 允许 GET 图片不鉴权 (如果需要)
  if (req.method === 'GET' && req.path.startsWith('/api/file')) {
      return next();
  }
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.includes(EXPECTED_TOKEN)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// 数据库连接池
const pool = mysql.createPool(DB_CONFIG);

// --- 1. KV 数据存储接口 (对应 storageService.get/save) ---

// GET: 获取数据
app.get('/api/kv', authenticate, async (req, res) => {
  const key = req.query.key;
  if (!key) return res.status(400).json({ error: 'Key required' });

  try {
    const [rows] = await pool.query('SELECT json_value FROM system_kv WHERE key_name = ?', [key]);
    if (rows.length > 0) {
      // 数据库存的是字符串，直接返回，前端会解析
      // 注意：由于 mysql 驱动可能自动解析 JSON 列，这里确保发送 JSON
      let val = rows[0].json_value;
      try {
          // 如果存进去是字符串化的JSON，这里尝试解析一下再返回，或者直接返回
          // 前端 storageService 期望得到 json 对象
          const jsonVal = JSON.parse(val);
          res.json(jsonVal); 
      } catch (e) {
          res.send(val); // 如果解析失败，直接发字符串
      }
    } else {
      res.json(null); // Key 不存在
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST: 保存数据
app.post('/api/kv', authenticate, async (req, res) => {
  const { key, value } = req.body;
  if (!key || value === undefined) return res.status(400).json({ error: 'Missing key or value' });

  try {
    const stringValue = JSON.stringify(value);
    // 使用 INSERT ... ON DUPLICATE KEY UPDATE 实现 "存在即更新，不存在即插入"
    await pool.query(
      'INSERT INTO system_kv (key_name, json_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE json_value = VALUES(json_value)',
      [key, stringValue]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --- 2. 文件上传接口 (对应 storageService.uploadAsset) ---

// 配置 Multer 存储到 COS 挂载目录
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 确保目录存在
    if (!fs.existsSync(COS_MOUNT_PATH)){
        fs.mkdirSync(COS_MOUNT_PATH, { recursive: true });
    }
    cb(null, COS_MOUNT_PATH);
  },
  filename: function (req, file, cb) {
    // 获取文件后缀
    const ext = path.extname(file.originalname);
    // 从 query 中获取 key 作为文件名，或者生成随机名
    // 前端 storageService 上传时使用了 query param: ?key=...
    let filename = req.query.key;
    
    if (!filename) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        filename = file.fieldname + '-' + uniqueSuffix + ext;
    } else {
        // 确保文件名安全，防止目录遍历
        filename = path.basename(filename); 
        // 补全后缀如果 key 没有后缀
        if (!filename.includes('.')) filename += ext;
    }
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

// POST: 上传文件
app.post('/api/file', authenticate, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // 返回可以直接访问的 URL
  // 假设 Nginx 配置将 /files 映射到了 COS 挂载目录
  // 前端收到这个 URL 后会存入 JSON 数据中
  const publicUrl = `/files/${req.file.filename}`;
  
  res.json({ success: true, url: publicUrl });
});

// GET: 读取文件 (如果不想配置 Nginx 静态映射，也可以用 Node 读取，但不推荐生产环境)
// 建议在 Nginx配置: location /files { alias /www/cosfs/yanyun-1250000000; }

app.listen(PORT, () => {
  console.log(`Backend Server running on port ${PORT}`);
  console.log(`COS Mount Path: ${COS_MOUNT_PATH}`);
});
