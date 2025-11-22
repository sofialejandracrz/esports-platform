const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'esports_admin',
  // NO enviamos password
  database: 'esports_platform',
});

console.log('Probando SIN enviar contraseña (trust mode)...');

client.connect()
  .then(() => {
    console.log('\n✅ ¡Conexión exitosa!');
    return client.query('SELECT current_user, current_database()');
  })
  .then((res) => {
    console.log('Usuario:', res.rows[0].current_user);
    console.log('Base de datos:', res.rows[0].current_database);
    client.end();
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ Error:', err.message);
    client.end();
    process.exit(1);
  });
