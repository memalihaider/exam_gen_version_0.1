import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'edu.largifysolutions.com',
  user: 'u421900954_PaperGenerator',
  password: 'PaperGeneratorByAhmad786',
  database: 'u421900954_ecompapgen',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;