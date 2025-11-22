require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

console.log('Intentando conectar con:');
console.log('Host:', process.env.DB_HOST);
console.log('Port:', process.env.DB_PORT);
console.log('User:', process.env.DB_USERNAME);
console.log('Password:', process.env.DB_PASSWORD);
console.log('Database:', process.env.DB_DATABASE);

client.connect()
  .then(() => {
    console.log('\n✅ Conexión exitosa!');
    return client.query('SELECT version()');
  })
  .then((res) => {
    console.log('PostgreSQL version:', res.rows[0].version);
    client.end();
  })
  .catch((err) => {
    console.error('\n❌ Error de conexión:', err.message);
    console.error('Stack:', err.stack);
    console.error('Code:', err.code);
    client.end();
    process.exit(1);
  });
