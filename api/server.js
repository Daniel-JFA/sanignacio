import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pg from 'pg';

const { Pool } = pg;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_church_key_123!';

// ── Database ──────────────────────────────────────────────────────────────────

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'editor',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS stories (
        id SERIAL PRIMARY KEY,
        badge VARCHAR(50) NOT NULL,
        badge_color VARCHAR(20) DEFAULT '#7A1F1F',
        title VARCHAR(255) NOT NULL,
        desc_text TEXT NOT NULL,
        content TEXT,
        img VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS milestones (
        id SERIAL PRIMARY KEY,
        year VARCHAR(20) NOT NULL,
        title VARCHAR(255) NOT NULL,
        desc_text TEXT NOT NULL,
        img VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS gallery (
        id SERIAL PRIMARY KEY,
        img VARCHAR(255) NOT NULL,
        alt VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        day_name VARCHAR(10) NOT NULL,
        day VARCHAR(3) NOT NULL,
        month VARCHAR(5) NOT NULL,
        time VARCHAR(20) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        img VARCHAR(255) NOT NULL,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_config (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Idempotent migrations
    await client.query(`UPDATE users SET role = 'super_admin' WHERE role = 'admin'`);
    await client.query(`ALTER TABLE stories ADD COLUMN IF NOT EXISTS content TEXT`);

    // Seed admin user
    const userRes = await client.query('SELECT * FROM users WHERE username = $1', ['admin']);
    if (userRes.rows.length === 0) {
      const hash = await bcrypt.hash('admin123', 10);
      await client.query(
        'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)',
        ['admin', hash, 'super_admin']
      );
    }

    // Seed milestones
    const mRes = await client.query('SELECT COUNT(*) FROM milestones');
    if (parseInt(mRes.rows[0].count, 10) === 0) {
      const items = [
        { year: '1803', title: 'Inicio de construcción', desc: 'Se inicia la construcción del templo bajo el estilo colonial de la época.', img: '/images/historia-fachada-primitiva.jpg' },
        { year: 'Siglo XIX', title: 'Uso como cuartel', desc: 'El templo fue utilizado como cuartel en tiempos de guerras civiles colombianas.', img: '/images/historia-frontis-antiguo.jpg' },
        { year: '1886', title: 'Llegada de los jesuitas', desc: 'Los jesuitas asumen la parroquia y establecen su misión educativa y social en Medellín.', img: '/images/historia-jesuitas-medellin.jpg' },
        { year: 'Actualidad', title: 'Patrimonio del centro de Medellín', desc: 'Hoy, San Ignacio es un bien patrimonial y corazón espiritual de fe y cultura.', img: '/images/fachada-actual.jpg' },
      ];
      for (const m of items) {
        await client.query(
          'INSERT INTO milestones (year, title, desc_text, img) VALUES ($1, $2, $3, $4)',
          [m.year, m.title, m.desc, m.img]
        );
      }
    }

    // Seed stories
    const sRes = await client.query('SELECT COUNT(*) FROM stories');
    if (parseInt(sRes.rows[0].count, 10) === 0) {
      const items = [
        { badge: 'HISTORIA', color: '#7A1F1F', title: 'Cuando San Ignacio fue cuartel', desc: 'Relato de un tiempo de tensiones en el que el templo se convirtió en la historia silenciosa de la historia nacional.', img: '/images/historia-frontis-antiguo.jpg' },
        { badge: 'FILOSOFÍA', color: '#5A1515', title: 'El silencio también habla', desc: 'Reflexiones sobre el valor del silencio, la oración y la escucha en la vida espiritual ignaciana.', img: '/images/interior-altar-mayor.jpg' },
        { badge: 'PATRIMONIO', color: '#7A1F1F', title: 'La plazuela y la ciudad', desc: 'Memorias y anécdotas de la plazuela de San Ignacio y su relación entrañable con el corazón de Medellín.', img: '/images/historia-fachada-plazuela.jpg' },
      ];
      for (const s of items) {
        await client.query(
          'INSERT INTO stories (badge, badge_color, title, desc_text, img) VALUES ($1, $2, $3, $4, $5)',
          [s.badge, s.color, s.title, s.desc, s.img]
        );
      }
    }

    // Seed gallery
    const gRes = await client.query('SELECT COUNT(*) FROM gallery');
    if (parseInt(gRes.rows[0].count, 10) === 0) {
      const items = [
        { img: '/images/fachada-tarde.jpg', alt: 'Fachada de la iglesia al atardecer' },
        { img: '/images/interior-altar-mayor.jpg', alt: 'Interior con altar mayor dorado' },
        { img: '/images/interior-nave.jpg', alt: 'Nave central de la iglesia' },
        { img: '/images/fachada-nocturna.jpg', alt: 'Fachada nocturna iluminada' },
        { img: '/images/interior-pulpito.jpg', alt: 'Púlpito barroco tallado' },
        { img: '/images/historia-sagrado-corazon.jpg', alt: 'Imagen del Sagrado Corazón' },
      ];
      for (const p of items) {
        await client.query('INSERT INTO gallery (img, alt) VALUES ($1, $2)', [p.img, p.alt]);
      }
    }

    // Seed events
    const eRes = await client.query('SELECT COUNT(*) FROM events');
    if (parseInt(eRes.rows[0].count, 10) === 0) {
      const items = [
        { day_name: 'SÁB', day: '25', month: 'MAY', time: '10:00 A.M.', title: 'Misa solemne', description: 'Celebración eucarística presidida por la comunidad jesuita e ignaciana.', img: '/images/interior-altar-mayor.jpg' },
        { day_name: 'MIE', day: '29', month: 'MAY', time: '6:30 P.M.', title: 'Charla: memoria y ciudad', description: 'Conversatorio sobre la historia de la Compañía de Jesús en la construcción de Medellín.', img: '/images/historia-jesuitas-medellin.jpg' },
        { day_name: 'VIE', day: '31', month: 'MAY', time: '8:00 A.M.', title: 'Recorrido patrimonial', description: 'Visita guiada por los espacios históricos y arquitectónicos de San Ignacio.', img: '/images/fachada-actual.jpg' },
      ];
      for (const e of items) {
        await client.query(
          'INSERT INTO events (day_name, day, month, time, title, description, img) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [e.day_name, e.day, e.month, e.time, e.title, e.description, e.img]
        );
      }
    }

    // Seed site_config (idempotent — DO NOTHING on conflict to preserve real data)
    const configDefaults = [
      ['address', 'Plazuela San Ignacio\nCra. 43 #49-59\nMedellín, Antioquia.'],
      ['mass_schedule', 'Lunes a viernes: 6:00 a.m., 7:00 a.m., 12:00 m., 6:00 p.m.\nSábados: 6:00 a.m., 7:00 a.m., 10:00 a.m., 12:00 m., 6:00 p.m.\nDomingos y festivos: 7:00 a.m., 9:00 a.m., 11:00 a.m., 12:00 m., 6:00 p.m.'],
      ['phone', '+57 (604) 444 1000'],
      ['email', 'sanignaciomedellin@jesuitas.org.co'],
      ['facebook_url', ''],
      ['instagram_url', ''],
      ['youtube_url', ''],
      ['maps_embed_url', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521529156054!2d-75.5685!3d6.2485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4429c2e09dfcbb%3A0x5f74f1a4b0f78e36!2sIglesia%20San%20Ignacio%20de%20Loyola!5e0!3m2!1ses!2sco!4v1700000000000'],
      ['maps_link', 'https://maps.google.com/?q=Iglesia+San+Ignacio+de+Loyola,+Medell%C3%ADn'],
    ];
    for (const [key, value] of configDefaults) {
      await client.query(
        'INSERT INTO site_config (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING',
        [key, value]
      );
    }
  } catch (err) {
    console.error('DB init error:', err);
    throw err;
  } finally {
    client.release();
  }
}

// Initialize database on cold start (top-level await, runs once per Lambda instance)
await initDb();

// ── File Upload ───────────────────────────────────────────────────────────────

const uploadDir = '/tmp/uploads';
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    if (filetypes.test(path.extname(file.originalname).toLowerCase()) && filetypes.test(file.mimetype)) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
  },
});

// ── Express App ───────────────────────────────────────────────────────────────

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// Auth middleware
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token de acceso no proporcionado.' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido o expirado.' });
    req.user = user;
    next();
  });
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) return res.status(403).json({ error: 'No tienes permisos para esta acción.' });
    next();
  };
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Usuario y contraseña requeridos.' });
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Credenciales incorrectas.' });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Credenciales incorrectas.' });
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, username: user.username, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// ── STORIES ───────────────────────────────────────────────────────────────────

app.get('/api/stories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM stories ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'Error al obtener las historias.' }); }
});

app.post('/api/stories', authenticateToken, async (req, res) => {
  const { badge, badge_color, title, desc_text, content, img } = req.body;
  if (!badge || !title || !desc_text || !img) return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  try {
    const result = await pool.query(
      'INSERT INTO stories (badge, badge_color, title, desc_text, content, img) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [badge, badge_color || '#7A1F1F', title, desc_text, content || null, img]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Error al guardar la historia.' }); }
});

app.put('/api/stories/:id', authenticateToken, async (req, res) => {
  const { badge, badge_color, title, desc_text, content, img } = req.body;
  if (!badge || !title || !desc_text || !img) return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  try {
    const result = await pool.query(
      'UPDATE stories SET badge=$1,badge_color=$2,title=$3,desc_text=$4,content=$5,img=$6 WHERE id=$7 RETURNING *',
      [badge, badge_color || '#7A1F1F', title, desc_text, content || null, img, req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Historia no encontrada.' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Error al actualizar la historia.' }); }
});

app.delete('/api/stories/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM stories WHERE id=$1 RETURNING *', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Historia no encontrada.' });
    res.json({ message: 'Historia eliminada.', deleted: result.rows[0] });
  } catch (err) { res.status(500).json({ error: 'Error al eliminar la historia.' }); }
});

// ── MILESTONES ────────────────────────────────────────────────────────────────

app.get('/api/milestones', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM milestones ORDER BY year ASC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'Error al obtener los hitos.' }); }
});

app.post('/api/milestones', authenticateToken, async (req, res) => {
  const { year, title, desc_text, img } = req.body;
  if (!year || !title || !desc_text || !img) return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  try {
    const result = await pool.query(
      'INSERT INTO milestones (year,title,desc_text,img) VALUES ($1,$2,$3,$4) RETURNING *',
      [year, title, desc_text, img]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Error al guardar el hito.' }); }
});

app.put('/api/milestones/:id', authenticateToken, async (req, res) => {
  const { year, title, desc_text, img } = req.body;
  if (!year || !title || !desc_text || !img) return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  try {
    const result = await pool.query(
      'UPDATE milestones SET year=$1,title=$2,desc_text=$3,img=$4 WHERE id=$5 RETURNING *',
      [year, title, desc_text, img, req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Hito no encontrado.' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Error al actualizar el hito.' }); }
});

app.delete('/api/milestones/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM milestones WHERE id=$1 RETURNING *', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Hito no encontrado.' });
    res.json({ message: 'Hito eliminado.', deleted: result.rows[0] });
  } catch (err) { res.status(500).json({ error: 'Error al eliminar el hito.' }); }
});

// ── GALLERY ───────────────────────────────────────────────────────────────────

app.get('/api/gallery', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM gallery ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'Error al obtener la galería.' }); }
});

app.post('/api/gallery', authenticateToken, async (req, res) => {
  const { img, alt } = req.body;
  if (!img || !alt) return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  try {
    const result = await pool.query('INSERT INTO gallery (img,alt) VALUES ($1,$2) RETURNING *', [img, alt]);
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Error al guardar en galería.' }); }
});

app.put('/api/gallery/:id', authenticateToken, async (req, res) => {
  const { img, alt } = req.body;
  if (!img || !alt) return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  try {
    const result = await pool.query('UPDATE gallery SET img=$1,alt=$2 WHERE id=$3 RETURNING *', [img, alt, req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Foto no encontrada.' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Error al actualizar la foto.' }); }
});

app.delete('/api/gallery/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM gallery WHERE id=$1 RETURNING *', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Elemento no encontrado.' });
    res.json({ message: 'Elemento de galería eliminado.', deleted: result.rows[0] });
  } catch (err) { res.status(500).json({ error: 'Error al eliminar de galería.' }); }
});

// ── USERS (super_admin only) ──────────────────────────────────────────────────

app.get('/api/users', authenticateToken, requireRole('super_admin'), async (req, res) => {
  try {
    const result = await pool.query('SELECT id,username,role,created_at FROM users ORDER BY created_at ASC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'Error al obtener los usuarios.' }); }
});

app.post('/api/users', authenticateToken, requireRole('super_admin'), async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username,password_hash,role) VALUES ($1,$2,$3) RETURNING id,username,role,created_at',
      [username, hash, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'El nombre de usuario ya existe.' });
    res.status(500).json({ error: 'Error al crear el usuario.' });
  }
});

app.put('/api/users/:id', authenticateToken, requireRole('super_admin'), async (req, res) => {
  const { id } = req.params;
  const { username, password, role } = req.body;
  if (parseInt(id, 10) === req.user.id && role && role !== req.user.role) {
    return res.status(400).json({ error: 'No puedes cambiar tu propio rol.' });
  }
  try {
    let query, params;
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      query = 'UPDATE users SET username=COALESCE($1,username),password_hash=$2,role=COALESCE($3,role) WHERE id=$4 RETURNING id,username,role,created_at';
      params = [username, hash, role, id];
    } else {
      query = 'UPDATE users SET username=COALESCE($1,username),role=COALESCE($2,role) WHERE id=$3 RETURNING id,username,role,created_at';
      params = [username, role, id];
    }
    const result = await pool.query(query, params);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Usuario no encontrado.' });
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'El nombre de usuario ya existe.' });
    res.status(500).json({ error: 'Error al actualizar el usuario.' });
  }
});

app.delete('/api/users/:id', authenticateToken, requireRole('super_admin'), async (req, res) => {
  const { id } = req.params;
  if (parseInt(id, 10) === req.user.id) return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta.' });
  try {
    const result = await pool.query('DELETE FROM users WHERE id=$1 RETURNING id,username', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Usuario no encontrado.' });
    res.json({ message: 'Usuario eliminado.', deleted: result.rows[0] });
  } catch (err) { res.status(500).json({ error: 'Error al eliminar el usuario.' }); }
});

// ── EVENTS ────────────────────────────────────────────────────────────────────

app.get('/api/events', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events WHERE active=true ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'Error al obtener los eventos.' }); }
});

app.get('/api/events/all', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'Error al obtener los eventos.' }); }
});

app.post('/api/events', authenticateToken, async (req, res) => {
  const { day_name, day, month, time, title, description, img, active } = req.body;
  if (!day_name || !day || !month || !time || !title || !description || !img) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO events (day_name,day,month,time,title,description,img,active) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
      [day_name, day, month, time, title, description, img, active !== undefined ? active : true]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Error al crear el evento.' }); }
});

app.put('/api/events/:id', authenticateToken, async (req, res) => {
  const { day_name, day, month, time, title, description, img, active } = req.body;
  try {
    const result = await pool.query(
      `UPDATE events SET day_name=COALESCE($1,day_name),day=COALESCE($2,day),month=COALESCE($3,month),
       time=COALESCE($4,time),title=COALESCE($5,title),description=COALESCE($6,description),
       img=COALESCE($7,img),active=COALESCE($8,active) WHERE id=$9 RETURNING *`,
      [day_name, day, month, time, title, description, img, active !== undefined ? active : null, req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Evento no encontrado.' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Error al actualizar el evento.' }); }
});

app.delete('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM events WHERE id=$1 RETURNING *', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Evento no encontrado.' });
    res.json({ message: 'Evento eliminado.', deleted: result.rows[0] });
  } catch (err) { res.status(500).json({ error: 'Error al eliminar el evento.' }); }
});

// ── SITE CONFIG ───────────────────────────────────────────────────────────────

app.get('/api/site-config', async (req, res) => {
  try {
    const result = await pool.query('SELECT key, value FROM site_config');
    const config = {};
    for (const row of result.rows) config[row.key] = row.value;
    res.json(config);
  } catch (err) { res.status(500).json({ error: 'Error al obtener la configuración.' }); }
});

app.put('/api/site-config', authenticateToken, async (req, res) => {
  const config = req.body;
  if (!config || typeof config !== 'object') return res.status(400).json({ error: 'Cuerpo de solicitud inválido.' });
  try {
    for (const [key, value] of Object.entries(config)) {
      await pool.query(
        'INSERT INTO site_config (key,value,updated_at) VALUES ($1,$2,NOW()) ON CONFLICT (key) DO UPDATE SET value=$2,updated_at=NOW()',
        [key, value]
      );
    }
    res.json({ message: 'Configuración actualizada.' });
  } catch (err) { res.status(500).json({ error: 'Error al guardar la configuración.' }); }
});

// ── IMAGE UPLOAD ──────────────────────────────────────────────────────────────

app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Archivo no subido o formato no válido.' });
  res.json({ fileUrl: `/uploads/${req.file.filename}` });
});

// ── Export for Vercel ─────────────────────────────────────────────────────────
export default app;
