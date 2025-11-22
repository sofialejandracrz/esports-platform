const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'esports_admin',
  // No password!
  database: 'esports_platform',
});

console.log('Intentando conectar SIN contraseña (trust mode)...');

client.connect()
  .then(() => {
    console.log('\n✅ Conexión exitosa sin contraseña!');
    return client.query('SELECT version()');
  })
  .then((res) => {
    console.log('PostgreSQL version:', res.rows[0].version);
    return client.query('SELECT current_user, current_database()');
  })
  .then((res) => {
    console.log('Usuario actual:', res.rows[0].current_user);
    console.log('Base de datos actual:', res.rows[0].current_database);
    client.end();
  })
  .catch((err) => {
    console.error('\n❌ Error de conexión:', err.message);
    console.error('Code:', err.code);
    client.end();
    process.exit(1);
  });
