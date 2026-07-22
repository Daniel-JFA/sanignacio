import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool, { initDb } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_church_key_123!';

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
  },
});

// Middleware
app.use(cors({ origin: '*' })); // Allow all origins for dev/production simplicity
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// JWT Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso no proporcionado.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado.' });
    }
    req.user = user;
    next();
  });
}

// Role-based authorization middleware
function requireRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ error: 'No tienes permisos para esta acción.' });
    }
    next();
  };
}

// ---------------- USER AUTHENTICATION ----------------

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña requeridos.' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({ token, username: user.username, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// ---------------- STORIES ENDPOINTS ----------------

app.get('/api/stories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM stories ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener las historias.' });
  }
});

app.post('/api/stories', authenticateToken, async (req, res) => {
  const { badge, badge_color, title, desc_text, content, img } = req.body;
  if (!badge || !title || !desc_text || !img) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO stories (badge, badge_color, title, desc_text, content, img) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [badge, badge_color || '#7A1F1F', title, desc_text, content || null, img]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar la historia.' });
  }
});

app.put('/api/stories/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { badge, badge_color, title, desc_text, content, img } = req.body;
  if (!badge || !title || !desc_text || !img) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  try {
    const result = await pool.query(
      'UPDATE stories SET badge = $1, badge_color = $2, title = $3, desc_text = $4, content = $5, img = $6 WHERE id = $7 RETURNING *',
      [badge, badge_color || '#7A1F1F', title, desc_text, content || null, img, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Historia no encontrada.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar la historia.' });
  }
});

app.delete('/api/stories/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM stories WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Historia no encontrada.' });
    }
    res.json({ message: 'Historia eliminada con éxito.', deleted: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar la historia.' });
  }
});

// ---------------- MILESTONES ENDPOINTS ----------------

app.get('/api/milestones', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM milestones ORDER BY year ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los hitos.' });
  }
});

app.post('/api/milestones', authenticateToken, async (req, res) => {
  const { year, title, desc_text, img } = req.body;
  if (!year || !title || !desc_text || !img) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO milestones (year, title, desc_text, img) VALUES ($1, $2, $3, $4) RETURNING *',
      [year, title, desc_text, img]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar el hito.' });
  }
});

app.put('/api/milestones/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { year, title, desc_text, img } = req.body;
  if (!year || !title || !desc_text || !img) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  try {
    const result = await pool.query(
      'UPDATE milestones SET year = $1, title = $2, desc_text = $3, img = $4 WHERE id = $5 RETURNING *',
      [year, title, desc_text, img, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Hito no encontrado.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el hito.' });
  }
});

app.delete('/api/milestones/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM milestones WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Hito no encontrado.' });
    }
    res.json({ message: 'Hito eliminado con éxito.', deleted: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar el hito.' });
  }
});

// ---------------- GALLERY ENDPOINTS ----------------

app.get('/api/gallery', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM gallery ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener la galería.' });
  }
});

app.post('/api/gallery', authenticateToken, async (req, res) => {
  const { img, alt } = req.body;
  if (!img || !alt) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO gallery (img, alt) VALUES ($1, $2) RETURNING *',
      [img, alt]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar en galería.' });
  }
});

app.delete('/api/gallery/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM gallery WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Elemento de galería no encontrado.' });
    }
    res.json({ message: 'Elemento de galería eliminado.', deleted: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar de galería.' });
  }
});

// ---------------- USERS ENDPOINTS (super_admin only) ----------------

app.get('/api/users', authenticateToken, requireRole('super_admin'), async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, role, created_at FROM users ORDER BY created_at ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los usuarios.' });
  }
});

app.post('/api/users', authenticateToken, requireRole('super_admin'), async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role, created_at',
      [username, hash, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'El nombre de usuario ya existe.' });
    }
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
      query = 'UPDATE users SET username = COALESCE($1, username), password_hash = $2, role = COALESCE($3, role) WHERE id = $4 RETURNING id, username, role, created_at';
      params = [username, hash, role, id];
    } else {
      query = 'UPDATE users SET username = COALESCE($1, username), role = COALESCE($2, role) WHERE id = $3 RETURNING id, username, role, created_at';
      params = [username, role, id];
    }
    const result = await pool.query(query, params);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'El nombre de usuario ya existe.' });
    }
    res.status(500).json({ error: 'Error al actualizar el usuario.' });
  }
});

app.delete('/api/users/:id', authenticateToken, requireRole('super_admin'), async (req, res) => {
  const { id } = req.params;
  if (parseInt(id, 10) === req.user.id) {
    return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta.' });
  }
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id, username', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    res.json({ message: 'Usuario eliminado.', deleted: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar el usuario.' });
  }
});

// ---------------- EVENTS ENDPOINTS ----------------

app.get('/api/events', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events WHERE active = true ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los eventos.' });
  }
});

app.get('/api/events/all', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los eventos.' });
  }
});

app.post('/api/events', authenticateToken, async (req, res) => {
  const { day_name, day, month, time, title, description, img, active } = req.body;
  if (!day_name || !day || !month || !time || !title || !description || !img) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO events (day_name, day, month, time, title, description, img, active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [day_name, day, month, time, title, description, img, active !== undefined ? active : true]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el evento.' });
  }
});

app.put('/api/events/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { day_name, day, month, time, title, description, img, active } = req.body;
  try {
    const result = await pool.query(
      `UPDATE events SET
        day_name = COALESCE($1, day_name),
        day = COALESCE($2, day),
        month = COALESCE($3, month),
        time = COALESCE($4, time),
        title = COALESCE($5, title),
        description = COALESCE($6, description),
        img = COALESCE($7, img),
        active = COALESCE($8, active)
      WHERE id = $9 RETURNING *`,
      [day_name, day, month, time, title, description, img, active !== undefined ? active : null, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Evento no encontrado.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el evento.' });
  }
});

app.delete('/api/events/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Evento no encontrado.' });
    }
    res.json({ message: 'Evento eliminado.', deleted: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar el evento.' });
  }
});

// ---------------- SITE CONFIG ENDPOINTS ----------------

app.get('/api/site-config', async (req, res) => {
  try {
    const result = await pool.query('SELECT key, value FROM site_config');
    const config = {};
    for (const row of result.rows) {
      config[row.key] = row.value;
    }
    res.json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener la configuración.' });
  }
});

app.put('/api/site-config', authenticateToken, async (req, res) => {
  const config = req.body;
  if (!config || typeof config !== 'object') {
    return res.status(400).json({ error: 'Cuerpo de solicitud inválido.' });
  }
  try {
    for (const [key, value] of Object.entries(config)) {
      await pool.query(
        'INSERT INTO site_config (key, value, updated_at) VALUES ($1, $2, NOW()) ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()',
        [key, value]
      );
    }
    res.json({ message: 'Configuración actualizada.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar la configuración.' });
  }
});

// ---------------- IMAGE UPLOAD ENDPOINT ----------------

app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Archivo no subido o formato no válido.' });
  }
  
  // Return the path that will be served statically
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ fileUrl });
});

// Database initialization & server start
async function startServer() {
  try {
    await initDb();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server due to DB initialization failure:', err);
    process.exit(1);
  }
}

startServer();
