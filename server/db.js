import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function initDb() {
  const client = await pool.connect();
  try {
    console.log('Initializing database schema...');
    
    // Create tables
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

    // Migrate old 'admin' role to 'super_admin' (one-time, safe to run repeatedly)
    await client.query(`UPDATE users SET role = 'super_admin' WHERE role = 'admin'`);

    // Add content column to stories if it doesn't exist (idempotent migration)
    await client.query(`
      ALTER TABLE stories ADD COLUMN IF NOT EXISTS content TEXT
    `);

    // Check and seed admin user
    const userRes = await client.query('SELECT * FROM users WHERE username = $1', ['admin']);
    if (userRes.rows.length === 0) {
      const hash = await bcrypt.hash('admin123', 10);
      await client.query(
        'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)',
        ['admin', hash, 'super_admin']
      );
      console.log('Default admin user created (username: admin, password: admin123)');
    }

    // Check and seed milestones
    const milestoneRes = await client.query('SELECT COUNT(*) FROM milestones');
    if (parseInt(milestoneRes.rows[0].count, 10) === 0) {
      const defaultMilestones = [
        { year: '1803', title: 'Inicio de construcción', desc: 'Se inicia la construcción del templo bajo el estilo colonial de la época.', img: '/images/story-cuartel.jpg' },
        { year: 'Siglo XIX', title: 'Uso como cuartel', desc: 'El templo fue utilizado como cuartel en tiempos de guerras civiles.', img: '/images/story-cuartel.jpg' },
        { year: '1886', title: 'Llegada de los jesuitas', desc: 'Los jesuitas asumen la parroquia y establecen su misión educativa y social.', img: '/images/story-silencio.jpg' },
        { year: 'Actualidad', title: 'Patrimonio del centro de Medellín', desc: 'Hoy, San Ignacio es un bien patrimonial y corazón espiritual de fe y cultura.', img: '/images/story-plazuela.jpg' },
      ];
      for (const m of defaultMilestones) {
        await client.query(
          'INSERT INTO milestones (year, title, desc_text, img) VALUES ($1, $2, $3, $4)',
          [m.year, m.title, m.desc, m.img]
        );
      }
      console.log('Seeded default milestones');
    }

    // Check and seed stories
    const storyRes = await client.query('SELECT COUNT(*) FROM stories');
    if (parseInt(storyRes.rows[0].count, 10) === 0) {
      const defaultStories = [
        { badge: 'HISTORIA', badgeColor: '#7A1F1F', title: 'Cuando San Ignacio fue cuartel', desc: 'Relato de un tiempo de tensiones en el que el templo se convirtió en la historia silenciosa de la historia nacional.', img: '/images/story-cuartel.jpg' },
        { badge: 'FILOSOFÍA', badgeColor: '#5A1515', title: 'El silencio también habla', desc: 'Reflexiones sobre el valor del silencio, la oración y la escucha en la vida espiritual.', img: '/images/story-silencio.jpg' },
        { badge: 'PATRIMONIO', badgeColor: '#7A1F1F', title: 'La plazuela y la ciudad', desc: 'Memorias y anécdotas de la plazuela de San Ignacio y su relación entrañable con Medellín.', img: '/images/story-plazuela.jpg' },
      ];
      for (const s of defaultStories) {
        await client.query(
          'INSERT INTO stories (badge, badge_color, title, desc_text, img) VALUES ($1, $2, $3, $4, $5)',
          [s.badge, s.badgeColor, s.title, s.desc, s.img]
        );
      }
      console.log('Seeded default stories');
    }

    // Check and seed gallery
    const galleryRes = await client.query('SELECT COUNT(*) FROM gallery');
    if (parseInt(galleryRes.rows[0].count, 10) === 0) {
      const defaultPhotos = [
        { img: '/images/gallery-1.jpg', alt: 'Fachada de la iglesia al atardecer' },
        { img: '/images/gallery-2.jpg', alt: 'Interior con altar dorado' },
        { img: '/images/gallery-3.jpg', alt: 'Plazuela San Ignacio' },
        { img: '/images/gallery-4.jpg', alt: 'Emblema JHS en piedra' },
      ];
      for (const p of defaultPhotos) {
        await client.query(
          'INSERT INTO gallery (img, alt) VALUES ($1, $2)',
          [p.img, p.alt]
        );
      }
      console.log('Seeded default gallery photos');
    }

    // Check and seed events
    const eventsRes = await client.query('SELECT COUNT(*) FROM events');
    if (parseInt(eventsRes.rows[0].count, 10) === 0) {
      const defaultEvents = [
        { day_name: 'SÁB', day: '25', month: 'MAY', time: '10:00 A.M.', title: 'Misa solemne', description: 'Celebración eucarística presidida por la comunidad jesuita e Ignaciana.', img: '/images/agenda-misa.jpg' },
        { day_name: 'MIE', day: '29', month: 'MAY', time: '6:30 P.M.', title: 'Charla: memoria y ciudad', description: 'Conversatorio sobre la historia de la Compañía de Jesús en la construcción de ciudad.', img: '/images/agenda-charla.jpg' },
        { day_name: 'VIE', day: '31', month: 'MAY', time: '8:00 A.M.', title: 'Recorrido patrimonial', description: 'Visita guiada por espacios históricos y arquitectónicos de San Ignacio.', img: '/images/tour-nave.jpg' },
      ];
      for (const e of defaultEvents) {
        await client.query(
          'INSERT INTO events (day_name, day, month, time, title, description, img) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [e.day_name, e.day, e.month, e.time, e.title, e.description, e.img]
        );
      }
      console.log('Seeded default events');
    }

    // Seed site_config keys (idempotent)
    const configDefaults = [
      ['address', 'Plazuela San Ignacio\nCra. 43 #49-59\nMedellín, Antioquia.'],
      ['schedule_weekdays', 'Lunes a sábado 6:00 a.m. – 7:00 p.m.'],
      ['schedule_sundays', 'Domingos 7:00 a.m. – 8:00 p.m.'],
      ['phone', ''],
      ['email', ''],
      ['facebook_url', 'https://facebook.com'],
      ['instagram_url', 'https://instagram.com'],
      ['youtube_url', 'https://youtube.com'],
      ['maps_embed_url', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0!2d-75.5685!3d6.2450!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4428dfb1e1c52d%3A0x1234567890abcdef!2sIglesia+San+Ignacio+de+Loyola!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco'],
      ['maps_link', 'https://maps.google.com/?q=Iglesia+San+Ignacio+de+Loyola+Medellin'],
    ];
    for (const [key, value] of configDefaults) {
      await client.query(
        'INSERT INTO site_config (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING',
        [key, value]
      );
    }
    console.log('Seeded default site_config');

    console.log('Database initialization completed successfully!');
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  } finally {
    client.release();
  }
}

export default pool;
