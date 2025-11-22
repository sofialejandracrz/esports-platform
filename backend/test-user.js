require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  host: '172.17.0.2',
  port: 5432,
  user: 'testuser',
  password: 'test123',
  database: 'esports_platform',
});

console.log('Probando con testuser...');

client.connect()
  .then(() => {
    console.log('\n✅ Conexión exitosa con testuser!');
    return client.query('SELECT version()');
  })
  .then((res) => {
    console.log('PostgreSQL version:', res.rows[0].version);
    client.end();
  })
  .catch((err) => {
    console.error('\n❌ Error:', err.message);
    client.end();
    process.exit(1);
  });
