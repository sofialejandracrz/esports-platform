const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5433, // Nuevo puerto
  user: 'esports_admin',
  database: 'esports_platform',
});

console.log('Probando conexión en puerto 5433...');

client.connect()
  .then(() => {
    console.log('\n✅ ¡CONEXIÓN EXITOSA!');
    return client.query('SELECT current_user, current_database(), version()');
  })
  .then((res) => {
    console.log('Usuario:', res.rows[0].current_user);
    console.log('Base de datos:', res.rows[0].current_database);
    console.log('Versión:', res.rows[0].version.split('\\n')[0]);
    client.end();
    console.log('\n🎉 ¡Problema resuelto!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ Error:', err.message);
    client.end();
    process.exit(1);
  });
